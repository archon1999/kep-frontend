import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getResourceById, resources } from 'app/routes/resources';
import type { ProblemsListParams } from '../../domain/ports/problems.repository.ts';
import type { StudyPlanListItem } from '../../domain/entities/problem.entity.ts';
import StudyPlanPreviewDialog from './StudyPlanPreviewDialog.tsx';

type Persona = 'beginner' | 'interview' | 'contest';
type AnswerValue = string;

type Answers = {
  persona?: Persona;
  lang?: string;
  beginnerGoal?: 'syntax' | 'problem-solving';
  beginnerPace?: 'light' | 'steady' | 'focused';
  interviewLevel?: 'easy' | 'medium' | 'mixed';
  interviewTopic?: 'arrays' | 'binary-search' | 'graphs' | 'dp';
  contestLevel?: 'starter' | 'regular' | 'advanced';
  contestFocus?: 'mixed' | 'upsolve' | 'topic';
  contestWeakness?: 'greedy' | 'graphs' | 'dp' | 'math';
  contestFormat?: 'short' | 'virtual' | 'hard';
};

type AdvisorQuestion = {
  key: keyof Answers;
  titleKey: string;
  subtitleKey?: string;
  options: Array<{ value: AnswerValue; labelKey: string; helperKey?: string }>;
};

type AdvisorRecommendation = {
  titleKey: string;
  subtitleKey: string;
  filterPatch: Partial<ProblemsListParams>;
  plan?: StudyPlanListItem;
};

const languageOptions = [
  { value: 'py', labelKey: 'problems.recommendation.languages.python' },
  { value: 'cpp', labelKey: 'problems.recommendation.languages.cpp' },
  { value: 'java', labelKey: 'problems.recommendation.languages.java' },
];

const beginnerQuestions: AdvisorQuestion[] = [
  {
    key: 'lang',
    titleKey: 'problems.recommendation.questions.language',
    subtitleKey: 'problems.recommendation.questions.languageSubtitle',
    options: languageOptions,
  },
  {
    key: 'beginnerGoal',
    titleKey: 'problems.recommendation.questions.beginnerGoal',
    options: [
      {
        value: 'syntax',
        labelKey: 'problems.recommendation.beginnerGoals.syntax',
        helperKey: 'problems.recommendation.beginnerGoals.syntaxHint',
      },
      {
        value: 'problem-solving',
        labelKey: 'problems.recommendation.beginnerGoals.problemSolving',
        helperKey: 'problems.recommendation.beginnerGoals.problemSolvingHint',
      },
    ],
  },
  {
    key: 'beginnerPace',
    titleKey: 'problems.recommendation.questions.beginnerPace',
    options: [
      { value: 'light', labelKey: 'problems.recommendation.pace.light' },
      { value: 'steady', labelKey: 'problems.recommendation.pace.steady' },
      { value: 'focused', labelKey: 'problems.recommendation.pace.focused' },
    ],
  },
];

const interviewQuestions: AdvisorQuestion[] = [
  {
    key: 'lang',
    titleKey: 'problems.recommendation.questions.language',
    subtitleKey: 'problems.recommendation.questions.languageSubtitle',
    options: languageOptions,
  },
  {
    key: 'interviewLevel',
    titleKey: 'problems.recommendation.questions.interviewLevel',
    options: [
      { value: 'easy', labelKey: 'problems.recommendation.interviewLevels.easy' },
      { value: 'medium', labelKey: 'problems.recommendation.interviewLevels.medium' },
      { value: 'mixed', labelKey: 'problems.recommendation.interviewLevels.mixed' },
    ],
  },
  {
    key: 'interviewTopic',
    titleKey: 'problems.recommendation.questions.interviewTopic',
    options: [
      { value: 'arrays', labelKey: 'problems.recommendation.interviewTopics.arrays' },
      { value: 'binary-search', labelKey: 'problems.recommendation.interviewTopics.binarySearch' },
      { value: 'graphs', labelKey: 'problems.recommendation.interviewTopics.graphs' },
      { value: 'dp', labelKey: 'problems.recommendation.interviewTopics.dp' },
    ],
  },
];

const contestBaseQuestions: AdvisorQuestion[] = [
  {
    key: 'lang',
    titleKey: 'problems.recommendation.questions.language',
    subtitleKey: 'problems.recommendation.questions.languageSubtitle',
    options: languageOptions,
  },
  {
    key: 'contestLevel',
    titleKey: 'problems.recommendation.questions.contestLevel',
    options: [
      { value: 'starter', labelKey: 'problems.recommendation.contestLevels.starter' },
      { value: 'regular', labelKey: 'problems.recommendation.contestLevels.regular' },
      { value: 'advanced', labelKey: 'problems.recommendation.contestLevels.advanced' },
    ],
  },
  {
    key: 'contestFocus',
    titleKey: 'problems.recommendation.questions.contestFocus',
    options: [
      { value: 'mixed', labelKey: 'problems.recommendation.contestFocus.mixed' },
      { value: 'upsolve', labelKey: 'problems.recommendation.contestFocus.upsolve' },
      { value: 'topic', labelKey: 'problems.recommendation.contestFocus.topic' },
    ],
  },
  {
    key: 'contestWeakness',
    titleKey: 'problems.recommendation.questions.contestWeakness',
    options: [
      { value: 'greedy', labelKey: 'problems.recommendation.contestWeakness.greedy' },
      { value: 'graphs', labelKey: 'problems.recommendation.contestWeakness.graphs' },
      { value: 'dp', labelKey: 'problems.recommendation.contestWeakness.dp' },
      { value: 'math', labelKey: 'problems.recommendation.contestWeakness.math' },
    ],
  },
];

const contestAdvancedQuestion: AdvisorQuestion = {
  key: 'contestFormat',
  titleKey: 'problems.recommendation.questions.contestFormat',
  options: [
    { value: 'short', labelKey: 'problems.recommendation.contestFormats.short' },
    { value: 'virtual', labelKey: 'problems.recommendation.contestFormats.virtual' },
    { value: 'hard', labelKey: 'problems.recommendation.contestFormats.hard' },
  ],
};

const choosePlan = (studyPlans: StudyPlanListItem[], persona?: Persona, answers?: Answers) => {
  if (studyPlans.length === 0) return undefined;
  if (persona === 'beginner') return studyPlans[0];
  if (persona === 'interview') return studyPlans[Math.min(1, studyPlans.length - 1)];
  if (persona === 'contest' && answers?.contestLevel === 'advanced') {
    return studyPlans[studyPlans.length - 1];
  }
  return studyPlans[Math.min(2, studyPlans.length - 1)];
};

const buildRecommendation = (
  answers: Answers,
  studyPlans: StudyPlanListItem[],
): AdvisorRecommendation => {
  const plan = choosePlan(studyPlans, answers.persona, answers);

  if (answers.persona === 'beginner') {
    return {
      titleKey: 'problems.recommendation.results.beginnerTitle',
      subtitleKey:
        answers.beginnerGoal === 'syntax'
          ? 'problems.recommendation.results.beginnerSyntaxSubtitle'
          : 'problems.recommendation.results.beginnerProblemSolvingSubtitle',
      filterPatch: {
        ordering: 'problem_rating,-solved',
        difficulty: answers.beginnerPace === 'focused' ? 2 : 1,
        lang: answers.lang,
      },
      plan,
    };
  }

  if (answers.persona === 'interview') {
    const difficulty =
      answers.interviewLevel === 'easy' ? 2 : answers.interviewLevel === 'medium' ? 3 : 4;
    return {
      titleKey: 'problems.recommendation.results.interviewTitle',
      subtitleKey: 'problems.recommendation.results.interviewSubtitle',
      filterPatch: {
        ordering: 'problem_rating,-solved',
        difficulty,
        lang: answers.lang,
        status: 3,
      },
      plan,
    };
  }

  const difficulty =
    answers.contestLevel === 'starter' ? 3 : answers.contestLevel === 'regular' ? 4 : 5;
  return {
    titleKey: 'problems.recommendation.results.contestTitle',
    subtitleKey:
      answers.contestFocus === 'upsolve'
        ? 'problems.recommendation.results.contestUpsolveSubtitle'
        : 'problems.recommendation.results.contestSubtitle',
    filterPatch: {
      ordering: answers.contestLevel === 'advanced' ? '-problem_rating,solved' : 'problem_rating,-solved',
      difficulty,
      lang: answers.lang,
      status: 3,
    },
    plan,
  };
};

type StudyPlanAdvisorDialogProps = {
  open: boolean;
  onClose: () => void;
  studyPlans: StudyPlanListItem[];
  onApplyFilters: (patch: Partial<ProblemsListParams>) => void;
};

const StudyPlanAdvisorDialog = ({
  open,
  onClose,
  studyPlans,
  onApplyFilters,
}: StudyPlanAdvisorDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({});
  const [previewPlanId, setPreviewPlanId] = useState<number | null>(null);

  const questions = useMemo(() => {
    if (!answers.persona) {
      return [
        {
          key: 'persona',
          titleKey: 'problems.recommendation.questions.persona',
          subtitleKey: 'problems.recommendation.questions.personaSubtitle',
          options: [
            {
              value: 'beginner',
              labelKey: 'problems.recommendation.personas.beginner',
              helperKey: 'problems.recommendation.personas.beginnerHint',
            },
            {
              value: 'interview',
              labelKey: 'problems.recommendation.personas.interview',
              helperKey: 'problems.recommendation.personas.interviewHint',
            },
            {
              value: 'contest',
              labelKey: 'problems.recommendation.personas.contest',
              helperKey: 'problems.recommendation.personas.contestHint',
            },
          ],
        } satisfies AdvisorQuestion,
      ];
    }

    if (answers.persona === 'beginner') return beginnerQuestions;
    if (answers.persona === 'interview') return interviewQuestions;

    return answers.contestLevel === 'advanced'
      ? [...contestBaseQuestions, contestAdvancedQuestion]
      : contestBaseQuestions;
  }, [answers.contestLevel, answers.persona]);

  const currentQuestionIndex = useMemo(() => {
    return questions.findIndex((question) => !answers[question.key]);
  }, [answers, questions]);

  const currentQuestion = currentQuestionIndex >= 0 ? questions[currentQuestionIndex] : null;
  const recommendation =
    currentQuestion === null && answers.persona ? buildRecommendation(answers, studyPlans) : null;

  const handleAnswer = (key: keyof Answers, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    const answeredQuestions = questions.filter((question) => answers[question.key]);
    const lastQuestion = answeredQuestions[answeredQuestions.length - 1];
    if (!lastQuestion) {
      setAnswers({});
      return;
    }

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[lastQuestion.key];
      if (lastQuestion.key === 'persona') {
        return {};
      }
      return next;
    });
  };

  const handleClose = () => {
    setAnswers({});
    setPreviewPlanId(null);
    onClose();
  };

  const handleApply = () => {
    if (!recommendation) return;
    onApplyFilters(recommendation.filterPatch);
    handleClose();
  };

  const handleOpenPlan = () => {
    if (!recommendation?.plan) return;
    if (!recommendation.plan.isPurchased) {
      setPreviewPlanId(recommendation.plan.id);
      return;
    }

    navigate(getResourceById(resources.StudyPlan, recommendation.plan.id));
    handleClose();
  };

  const progress = recommendation ? 100 : (Math.max(currentQuestionIndex, 0) / questions.length) * 100;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('problems.recommendation.title')}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 999 }} />

          {currentQuestion ? (
            <>
              <div>
                <Typography variant="h6">{t(currentQuestion.titleKey)}</Typography>
                {currentQuestion.subtitleKey ? (
                  <Typography variant="body2" color="text.secondary" mt={0.75}>
                    {t(currentQuestion.subtitleKey)}
                  </Typography>
                ) : null}
              </div>

              <Stack spacing={1.25}>
                {currentQuestion.options.map((option) => (
                  <Card
                    key={option.value}
                    variant="outlined"
                    sx={{
                      borderRadius: 2.5,
                    }}
                  >
                    <Button
                      color="inherit"
                      onClick={() => handleAnswer(currentQuestion.key, option.value)}
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        px: 2,
                        py: 1.5,
                      }}
                    >
                      <Stack alignItems="flex-start" spacing={0.35}>
                        <Typography variant="subtitle2" color="text.primary">
                          {t(option.labelKey)}
                        </Typography>
                        {option.helperKey ? (
                          <Typography variant="body2" color="text.secondary">
                            {t(option.helperKey)}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Button>
                  </Card>
                ))}
              </Stack>
            </>
          ) : recommendation ? (
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Object.entries(answers).map(([key, value]) => (
                  <Chip key={key} size="small" label={t(`problems.recommendation.answerLabels.${value}`)} />
                ))}
              </Stack>

              <Card variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
                <Typography variant="h6">{t(recommendation.titleKey)}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {t(recommendation.subtitleKey)}
                </Typography>
                {recommendation.plan ? (
                  <Typography variant="body2" mt={1.5}>
                    {t('problems.recommendation.planSuggestion', { title: recommendation.plan.title })}
                  </Typography>
                ) : null}
              </Card>
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={currentQuestionIndex === 0 && !answers.persona ? handleClose : handleBack} color="inherit">
          {t('common.back')}
        </Button>
        {recommendation?.plan ? (
          <Button onClick={handleOpenPlan} color="inherit">
            {t('problems.recommendation.openPlan')}
          </Button>
        ) : null}
        {recommendation ? (
          <Button onClick={handleApply} variant="contained">
            {t('problems.recommendation.applyProblems')}
          </Button>
        ) : null}
      </DialogActions>

      <StudyPlanPreviewDialog
        open={Boolean(previewPlanId)}
        studyPlanId={previewPlanId}
        onClose={() => setPreviewPlanId(null)}
      />
    </Dialog>
  );
};

export default StudyPlanAdvisorDialog;
