import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import {
  finishTest,
  submitAnswer,
  testingMutations,
} from 'modules/testing/application/mutations.ts';
import { useTestPass } from 'modules/testing/application/queries.ts';
import { QuestionType } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { toast } from 'sonner';
import { buildAnswerResult } from './answers.ts';
import ClassificationQuestion from './components/ClassificationQuestion.tsx';
import CodeInputQuestion from './components/CodeInputQuestion.tsx';
import ConformityQuestion from './components/ConformityQuestion.tsx';
import MultipleChoiceQuestion from './components/MultipleChoiceQuestion.tsx';
import OrderingQuestion from './components/OrderingQuestion.tsx';
import SingleChoiceQuestion from './components/SingleChoiceQuestion.tsx';
import TestPassActions from './components/TestPassActions.tsx';
import TestPassMobileToolbar from './components/TestPassMobileToolbar.tsx';
import TestPassSidebar from './components/TestPassSidebar.tsx';
import TestPassSkeleton from './components/TestPassSkeleton.tsx';
import TextInputQuestion from './components/TextInputQuestion.tsx';
import { QuestionState, TestPassQuestion } from './types.ts';
import { buildInitialState, formatRemainingTime } from './utils.ts';

const TestPassPage = () => {
  const { id: testPassId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { topbarHeight } = useNavContext();

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
  const questionAnchorRef = useRef<HTMLDivElement>(null);
  const previousQuestionNumberRef = useRef<number | undefined>(undefined);

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
    const previousNumber = previousQuestionNumberRef.current;
    const nextNumber = currentQuestion?.number;
    previousQuestionNumberRef.current = nextNumber;
    if (
      !isMobile ||
      previousNumber === undefined ||
      nextNumber === undefined ||
      previousNumber === nextNumber
    )
      return;
    const frame = requestAnimationFrame(() =>
      questionAnchorRef.current?.scrollIntoView({ block: 'start' }),
    );
    return () => cancelAnimationFrame(frame);
  }, [currentQuestion?.number, isMobile]);

  useEffect(() => {
    if (!testPass?.test?.questions?.length) {
      return;
    }

    const hydrated = testPass.test.questions.map(
      (question) =>
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

  const renderQuestion = () => {
    if (!currentQuestion) {
      return null;
    }

    const state = ensureState(currentQuestion);

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice: {
        const selected = state.type === QuestionType.SingleChoice ? state.selectedOption : -1;
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
  const hasFinishResult = finishResult !== null && Number.isFinite(finishResult);

  if (error || (!isLoading && !testPass)) {
    return (
      <Paper
        elevation={0}
        variant="elevation"
        sx={{ minHeight: '100%', borderRadius: 0, border: 0, bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg" disableGutters sx={{ p: { xs: 3, md: 5 } }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={() => mutate()}>
                {t('tests.retry')}
              </Button>
            }
          >
            {t('tests.passLoadError')}
          </Alert>
        </Container>
      </Paper>
    );
  }

  if (!isLoading && testPass && !testPass.test.questions?.length) {
    return (
      <Paper
        elevation={0}
        variant="elevation"
        sx={{ minHeight: '100%', borderRadius: 0, border: 0, bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg" disableGutters sx={{ p: { xs: 3, md: 5 } }}>
          <Alert severity="info">{t('tests.noQuestions')}</Alert>
        </Container>
      </Paper>
    );
  }

  if (isLoading || !currentQuestion) {
    return <TestPassSkeleton />;
  }

  return (
    <Paper
      elevation={0}
      variant="elevation"
      sx={{ minHeight: '100%', borderRadius: 0, border: 0, bgcolor: 'background.paper' }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          pb: { xs: 'calc(88px + env(safe-area-inset-bottom))', md: 5 },
        }}
      >
        <Stack direction="column" spacing={{ xs: 2, md: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{
              pb: { xs: 0, md: 3 },
              borderBottom: { xs: 0, md: '1px solid' },
              borderColor: 'divider',
            }}
          >
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {testPass?.test.chapter?.title || t('tests.passTitle')}
              </Typography>
              <Typography
                component="h1"
                variant="h5"
                fontWeight={600}
                sx={{
                  overflowWrap: 'anywhere',
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {testPass?.test.title}
              </Typography>
            </Stack>
            {!isMobile && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                role="timer"
                aria-label={t('tests.timeLeft')}
                sx={{
                  flexShrink: 0,
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: remainingMs < 60000 ? 'warning.lighter' : 'background.elevation1',
                }}
              >
                <IconifyIcon
                  icon="material-symbols:timer-outline-rounded"
                  sx={{
                    fontSize: 24,
                    color: remainingMs < 60000 ? 'warning.main' : 'text.secondary',
                  }}
                />
                <Stack spacing={0.25}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tests.timeLeft')}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color={remainingMs < 60000 ? 'warning.dark' : 'text.primary'}
                    sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, lineHeight: 1.3 }}
                  >
                    {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>

          {isMobile && (
            <TestPassMobileToolbar
              currentNumber={currentQuestion.number}
              total={questions.length}
              time={`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
              urgent={remainingMs < 60000}
              disabled={isSubmitting || isFinishing || isFinished}
              questionsOpen={questionsOpen}
              onOpenQuestions={() => setQuestionsOpen(true)}
            />
          )}

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 3, md: 2, lg: 3 }}
            alignItems="flex-start"
          >
            <Stack
              ref={questionAnchorRef}
              spacing={3}
              sx={{
                flex: 1,
                minWidth: 0,
                width: { xs: '100%', md: 'auto' },
                scrollMarginTop: theme.mixins.topOffset(
                  topbarHeight ?? theme.mixins.topbar.default,
                  76,
                ),
                '& input, & textarea': {
                  scrollMarginBottom: 'calc(88px + env(safe-area-inset-bottom))',
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent={isMobile ? 'flex-end' : 'space-between'}
                gap={1}
                flexWrap="wrap"
              >
                {!isMobile && (
                  <Chip
                    size="small"
                    variant="soft"
                    color="neutral"
                    label={t('tests.questionLabel', {
                      index: currentQuestion.number,
                      total: questions.length,
                    })}
                  />
                )}
                <Chip
                  size="small"
                  variant="soft"
                  color={currentQuestion.answered ? 'success' : 'neutral'}
                  icon={
                    currentQuestion.answered ? (
                      <IconifyIcon icon="material-symbols:check-rounded" />
                    ) : undefined
                  }
                  label={currentQuestion.answered ? t('tests.answered') : t('tests.notAnswered')}
                />
              </Stack>

              <Box>{renderQuestion()}</Box>

              <TestPassActions
                mobile={isMobile}
                previousDisabled={currentIndex === 0}
                disabled={isSubmitting || isFinishing || isFinished}
                submitting={isSubmitting}
                onPrevious={() => handleQuestionSelect(currentIndex - 1)}
                onSubmit={() => handleSubmitAnswer()}
              />
            </Stack>

            {!isMobile && (
              <Box
                sx={{
                  width: { xs: '100%', md: 280, lg: 328 },
                  flexShrink: 0,
                  alignSelf: 'stretch',
                }}
              >
                <TestPassSidebar
                  questions={questions}
                  currentIndex={currentIndex}
                  disabled={isSubmitting || isFinishing || isFinished}
                  isFinishing={isFinishing}
                  onQuestionSelect={handleQuestionSelect}
                  onFinish={() => handleFinish()}
                />
              </Box>
            )}
          </Stack>

          <Drawer
            anchor="bottom"
            open={isMobile && questionsOpen}
            onClose={() => setQuestionsOpen(false)}
            slotProps={{
              paper: {
                id: 'test-mobile-questions',
                role: 'dialog',
                'aria-labelledby': 'test-mobile-questions-title',
                sx: {
                  borderRadius: '16px 16px 0 0',
                  maxHeight: '80dvh',
                  pb: 'env(safe-area-inset-bottom)',
                },
              },
            }}
          >
            <TestPassSidebar
              mobile
              questions={questions}
              currentIndex={currentIndex}
              disabled={isSubmitting || isFinishing || isFinished}
              isFinishing={isFinishing}
              onClose={() => setQuestionsOpen(false)}
              onQuestionSelect={async (index) => {
                const selected = await handleQuestionSelect(index);
                if (selected) setQuestionsOpen(false);
              }}
              onFinish={() => handleFinish()}
            />
          </Drawer>

          <Dialog
            open={isFinished}
            onClose={() => {
              setFinishResult(null);
              handleNavigateToTest();
            }}
            fullWidth
            maxWidth="xs"
            aria-labelledby="test-finish-title"
          >
            <DialogTitle id="test-finish-title" sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'success.lighter',
                  color: 'success.main',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <IconifyIcon icon="material-symbols:check-rounded" sx={{ fontSize: 28 }} />
              </Box>
              {t('tests.finishTitle')}
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
              {hasFinishResult ? (
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    {t('tests.resultsColumns.score')}
                  </Typography>
                  <Typography variant="h3" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {finishResult}
                    <Box
                      component="span"
                      sx={{ color: 'text.secondary', fontSize: '1.25rem', fontWeight: 400 }}
                    >
                      {' / '}
                      {testPass?.test.questionsCount ?? questions.length}
                    </Box>
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('tests.finishNoResult')}
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ minHeight: { xs: 44, md: 36 } }}
                onClick={() => {
                  setFinishResult(null);
                  handleNavigateToTest();
                }}
              >
                {t('tests.returnToTest')}
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </Paper>
  );
};

export default TestPassPage;
