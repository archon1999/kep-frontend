import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { finishTest, submitAnswer } from 'modules/testing/application/mutations.ts';
import { useTestPass } from 'modules/testing/application/queries.ts';
import { QuestionState, TestPassQuestion } from 'modules/testing/domain/entities/test-pass.types';
import { hydrateQuestion } from 'modules/testing/domain/utils/hydrate-question';
import { buildAnswerResult } from 'modules/testing/domain/utils/test-pass-answer';
import {
  buildInitialState,
  formatRemainingTime,
} from 'modules/testing/domain/utils/test-pass-state';
import { toast } from 'sonner';

export const useTestPassPage = () => {
  const { id: testPassId } = useParams();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const { data: testPass, isLoading, error, mutate } = useTestPass(testPassId);

  useDocumentTitle(
    testPass?.test ? 'pageTitles.testPass' : undefined,
    testPass?.test
      ? {
          testTitle: testPass.test.title ?? '',
        }
      : undefined,
  );

  const [questions, setQuestions] = useState<TestPassQuestion[]>([]);

  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});

  const [currentIndex, setCurrentIndex] = useState(0);

  const [remainingMs, setRemainingMs] = useState(0);

  const [timerReady, setTimerReady] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFinishing, setIsFinishing] = useState(false);

  const [isFinished, setIsFinished] = useState(false);

  const [finishResult, setFinishResult] = useState<number | null>(null);

  const [questionsOpen, setQuestionsOpen] = useState(false);

  const autoFinishRef = useRef(false);

  const getQuestionKey = (question: TestPassQuestion) =>
    (question.id ?? question.number).toString();

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const ensureState = (question: TestPassQuestion): QuestionState =>
    questionStates[getQuestionKey(question)] ?? buildInitialState(question);

  const updateState = (
    question: TestPassQuestion,
    updater: (prev: QuestionState) => QuestionState,
  ) => {
    const key = getQuestionKey(question);
    setQuestionStates((prev) => ({
      ...prev,
      [key]: updater(prev[key] ?? buildInitialState(question)),
    }));
  };

  const handleFinish = async (auto = false) => {
    if (isFinished || !testPass) {
      return;
    }

    setIsFinishing(true);

    try {
      if (
        !auto &&
        currentQuestion &&
        !buildAnswerResult(currentQuestion, ensureState(currentQuestion)).isEmpty
      ) {
        const saved = await handleSubmitAnswer({ autoAdvance: false, silent: true });
        if (saved === false) return;
      }
      const response = await finishTest(testPass.id);

      if (response.success) {
        setIsFinished(true);
        setFinishResult(response.result ?? null);
        setQuestionsOpen(false);
      } else if (!auto) {
        toast.error(t('tests.finishError'));
      }
    } catch {
      if (!auto) {
        toast.error(t('tests.finishError'));
      }
    } finally {
      setIsFinishing(false);
    }
  };

  const handleSubmitAnswer = async (options?: { autoAdvance?: boolean; silent?: boolean }) => {
    const autoAdvance = options?.autoAdvance ?? true;
    const silent = options?.silent ?? false;

    if (!testPass || !currentQuestion || isFinished) {
      return;
    }

    const currentState = ensureState(currentQuestion);
    const answerResult = buildAnswerResult(currentQuestion, currentState);

    if (answerResult.isEmpty) {
      if (!silent) {
        toast.warning(t('tests.fillAnswer'));
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await submitAnswer(testPass.id, currentQuestion.number, answerResult.answer);

      setQuestions((prev) =>
        prev.map((question) =>
          question.number === currentQuestion.number ? { ...question, answered: true } : question,
        ),
      );

      if (!silent) {
        toast.success(t('tests.answerSaved'));
      }

      if (autoAdvance && questions.length) {
        const nextQuestionNumber = (currentQuestion.number % questions.length) + 1;
        const nextIndex = questions.findIndex((question) => question.number === nextQuestionNumber);
        setCurrentIndex(nextIndex === -1 ? (currentIndex + 1) % questions.length : nextIndex);
      }
      return true;
    } catch {
      toast.error(t('tests.answerSaveError'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionSelect = async (index: number) => {
    if (isFinished) {
      return;
    }

    const saved = await handleSubmitAnswer({ autoAdvance: false, silent: true });
    if (saved === false) {
      return false;
    }
    setCurrentIndex(index);
    return true;
  };

  useEffect(() => {
    if (!testPass?.test?.questions?.length) {
      return;
    }

    const hydrated = testPass.test.questions.map(
      (question) => hydrateQuestion(question) as TestPassQuestion,
    );

    const initialStates = hydrated.reduce<Record<string, QuestionState>>((acc, question) => {
      acc[getQuestionKey(question)] = buildInitialState(question);
      return acc;
    }, {});

    setQuestions(hydrated);
    setQuestionStates(initialStates);
    setCurrentIndex(0);
    setTimerReady(false);
    setIsFinished(false);
    setFinishResult(null);
    autoFinishRef.current = false;
  }, [testPass?.test?.questions]);

  useEffect(() => {
    if (!testPass) {
      return;
    }

    setTimerReady(false);

    const durationParts = (testPass.test.duration ?? '0:0:0')
      .split(':')
      .map((value) => Number(value) || 0);
    const [hours, minutes, seconds] = [
      durationParts[0] ?? 0,
      durationParts[1] ?? 0,
      durationParts[2] ?? 0,
    ];

    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalMs <= 0) {
      setRemainingMs(0);
      setTimerReady(true);
      return;
    }

    const startedAt = new Date(testPass.started).valueOf();
    const elapsed = Number.isNaN(startedAt) ? 0 : Date.now() - startedAt;

    setRemainingMs(Math.max(totalMs - elapsed, 0));
    setTimerReady(true);
  }, [testPass?.started, testPass?.test.duration]);

  useEffect(() => {
    if (!timerReady) {
      return;
    }

    if (remainingMs <= 0) {
      return;
    }

    const timer = setInterval(() => setRemainingMs((prev) => Math.max(prev - 1000, 0)), 1000);

    return () => clearInterval(timer);
  }, [timerReady, remainingMs]);

  useEffect(() => {
    if (!timerReady || !testPass || isFinished) {
      return;
    }

    if (remainingMs <= 0 && !isFinishing && !autoFinishRef.current && !isFinished) {
      autoFinishRef.current = true;
      handleFinish(true);
    }
  }, [timerReady, remainingMs, testPass, isFinishing, isFinished]);

  const handleNavigateToTest = () => {
    if (testPass) {
      navigate(getResourceById(resources.Test, testPass.test.id), { replace: true });
    }
  };

  const timeLeft = formatRemainingTime(remainingMs);

  const hasFinishResult = finishResult !== null && Number.isFinite(finishResult);
  return {
    testPass,
    isLoading,
    error,
    mutate,
    handleFinish,
    handleSubmitAnswer,
    isFinished,
    isFinishing,
    currentQuestion,
    ensureState,
    finishResult,
    setFinishResult,
    questionsOpen,
    setQuestionsOpen,
    isSubmitting,
    questions,
    currentIndex,
    handleQuestionSelect,
    handleNavigateToTest,
    hasFinishResult,
    updateState,
    remainingMs,
    timeLeft,
  };
};
