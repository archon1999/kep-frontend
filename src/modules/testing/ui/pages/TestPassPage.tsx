import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getResourceById, resources } from 'app/routes/resources';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { finishTest, submitAnswer, testingMutations } from '../../application/mutations.ts';
import { useTestPass } from '../../application/queries.ts';
import { QuestionType } from '../../domain';
import { buildAnswerResult } from './test-pass/answers.ts';
import { buildInitialState, formatRemainingTime } from './test-pass/utils.ts';
import { QuestionState, TestPassQuestion } from './test-pass/types.ts';
import SingleChoiceQuestion from './test-pass/components/SingleChoiceQuestion.tsx';
import MultipleChoiceQuestion from './test-pass/components/MultipleChoiceQuestion.tsx';
import TextInputQuestion from './test-pass/components/TextInputQuestion.tsx';
import CodeInputQuestion from './test-pass/components/CodeInputQuestion.tsx';
import ConformityQuestion from './test-pass/components/ConformityQuestion.tsx';
import OrderingQuestion from './test-pass/components/OrderingQuestion.tsx';
import ClassificationQuestion from './test-pass/components/ClassificationQuestion.tsx';

const TestPassPage = () => {
  const { id: testPassId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: testPass, isLoading } = useTestPass(testPassId);
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
  const autoFinishRef = useRef(false);

  const getQuestionKey = (question: TestPassQuestion) =>
    (question.id ?? question.number).toString();

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex],
  );

  const ensureState = (question: TestPassQuestion): QuestionState =>
    questionStates[getQuestionKey(question)] ?? buildInitialState(question);

  const updateState = (question: TestPassQuestion, updater: (prev: QuestionState) => QuestionState) => {
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
      const response = await finishTest(testPass.id);

      if (response.success) {
        setIsFinished(true);
        setFinishResult(response.result ?? null);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionSelect = async (index: number) => {
    if (isFinished) {
      return;
    }

    await handleSubmitAnswer({ autoAdvance: false, silent: true });
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!testPass?.test?.questions?.length) {
      return;
    }

    const hydrated = testPass.test.questions.map((question) =>
      testingMutations.testingRepository.hydrateQuestion(question) as TestPassQuestion,
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

    const timer = setInterval(
      () => setRemainingMs((prev) => Math.max(prev - 1000, 0)),
      1000,
    );

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

  const renderQuestion = () => {
    if (!currentQuestion) {
      return null;
    }

    const state = ensureState(currentQuestion);

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice: {
        const selected =
          state.type === QuestionType.SingleChoice ? state.selectedOption : -1;
        return (
          <SingleChoiceQuestion
            question={currentQuestion}
            selectedOption={selected}
            onChange={(value) =>
              updateState(currentQuestion, () => ({
                type: QuestionType.SingleChoice,
                selectedOption: value,
              }))
            }
          />
        );
      }
      case QuestionType.MultipleChoice: {
        const selectedOptions =
          state.type === QuestionType.MultipleChoice ? state.selectedOptions : [];
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedOptions={selectedOptions}
            onToggle={(index) =>
              updateState(currentQuestion, () => {
                const next = new Set(selectedOptions);
                if (next.has(index)) {
                  next.delete(index);
                } else {
                  next.add(index);
                }
                const ordered = Array.from(next).sort((a, b) => a - b);
                return { type: QuestionType.MultipleChoice, selectedOptions: ordered };
              })
            }
          />
        );
      }
      case QuestionType.TextInput: {
        const value = state.type === QuestionType.TextInput ? state.value : '';
        return (
          <TextInputQuestion
            question={currentQuestion}
            value={value}
            onChange={(input) =>
              updateState(currentQuestion, () => ({
                type: QuestionType.TextInput,
                value: input,
              }))
            }
          />
        );
      }
      case QuestionType.CodeInput: {
        const value = state.type === QuestionType.CodeInput ? state.value : '';
        return (
          <CodeInputQuestion
            question={currentQuestion}
            value={value}
            onChange={(input) =>
              updateState(currentQuestion, () => ({
                type: QuestionType.CodeInput,
                value: input,
              }))
            }
          />
        );
      }
      case QuestionType.Conformity: {
        const groupOne = state.type === QuestionType.Conformity ? state.groupOne : [];
        const groupTwo = state.type === QuestionType.Conformity ? state.groupTwo : [];
        return (
          <ConformityQuestion
            question={currentQuestion}
            groupOne={groupOne}
            groupTwo={groupTwo}
            onChange={(payload) =>
              updateState(currentQuestion, () => ({
                type: QuestionType.Conformity,
                groupOne: payload.groupOne ?? groupOne,
                groupTwo: payload.groupTwo ?? groupTwo,
              }))
            }
          />
        );
      }
      case QuestionType.Ordering: {
        const ordering = state.type === QuestionType.Ordering ? state.ordering : [];
        return (
          <OrderingQuestion
            question={currentQuestion}
            ordering={ordering}
            onChange={(items) =>
              updateState(currentQuestion, () => ({
                type: QuestionType.Ordering,
                ordering: items,
              }))
            }
          />
        );
      }
      case QuestionType.Classification: {
        const groups = state.type === QuestionType.Classification ? state.groups : [];
        return (
          <ClassificationQuestion
            question={currentQuestion}
            groups={groups}
            onChange={(nextGroups) =>
              updateState(currentQuestion, () => ({
                type: QuestionType.Classification,
                groups: nextGroups,
              }))
            }
          />
        );
      }
      default:
        return null;
    }
  };

  const timeLeft = formatRemainingTime(remainingMs);

  if (isLoading || !currentQuestion) {
    return (
      <Box sx={{ ...responsivePagePaddingSx, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={800}>
            {testPass?.test.title}
          </Typography>
          <Chip
            color={remainingMs > 0 ? 'primary' : 'error'}
            label={`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
          />
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <Card>
              <CardContent>{renderQuestion()}</CardContent>

              <Divider />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{ p: 2 }}
              >
                <Chip
                  color={currentQuestion.answered ? 'success' : 'warning'}
                  label={currentQuestion.answered ? t('tests.answered') : t('tests.notAnswered')}
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmitAnswer()}
                  disabled={isSubmitting || isFinishing || isFinished}
                  sx={{ minWidth: 180 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    t('tests.submitAnswer')
                  )}
                </Button>
              </Stack>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack direction="column" spacing={2}>
              <Card>
                <CardContent>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('tests.timeLeft')}
                    </Typography>
                    <Stack direction="row" spacing={1.5} justifyContent="space-between">
                      {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((value, index) => (
                        <Stack
                          key={`${value}-${index}`}
                          direction="column"
                          spacing={0.5}
                          alignItems="center"
                          sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            minWidth: 72,
                          }}
                        >
                          <Typography variant="h5" fontWeight={800}>
                            {value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {index === 0
                              ? t('tests.hour')
                              : index === 1
                                ? t('tests.minute')
                                : t('tests.second')}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleFinish()}
                      disabled={isFinishing || isFinished}
                    >
                      {isFinishing ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        t('tests.finishTest')
                      )}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack direction="column" spacing={1.5}>
                    <Typography variant="subtitle1" fontWeight={700} textAlign="center">
                      {t('tests.questions')}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                      {questions.map((question, index) => {
                        const isCurrent = index === currentIndex;
                        const isAnswered = question.answered;

                        return (
                          <Button
                            key={`${getQuestionKey(question)}-nav`}
                            variant={isCurrent ? 'contained' : 'outlined'}
                            color={
                              isCurrent ? 'primary' : isAnswered ? 'success' : 'inherit'
                            }
                            size="small"
                            onClick={() => handleQuestionSelect(index)}
                            disabled={isSubmitting || isFinishing || isFinished}
                            sx={{ minWidth: 44, height: 36 }}
                          >
                            {question.number}
                          </Button>
                        );
                      })}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Dialog
          open={finishResult !== null}
          onClose={() => {
            setFinishResult(null);
            handleNavigateToTest();
          }}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>{t('tests.finish')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('tests.finishSuccess', { result: finishResult ?? 0 })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setFinishResult(null);
                handleNavigateToTest();
              }}
            >
              {t('tests.finish')}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default TestPassPage;
