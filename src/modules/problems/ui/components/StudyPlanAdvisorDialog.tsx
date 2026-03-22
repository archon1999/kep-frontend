import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
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
import { useRecommendationResolve } from '../../application/queries.ts';
import type {
  StudyPlanListItem,
} from '../../domain/entities/problem.entity.ts';
import type { ProblemsListParams } from '../../domain/ports/problems.repository.ts';
import StudyPlanPreviewDialog from './StudyPlanPreviewDialog.tsx';

type StudyPlanAdvisorDialogProps = {
  open: boolean;
  onClose: () => void;
  studyPlans: StudyPlanListItem[];
  currentFilters: Partial<ProblemsListParams>;
  onApplyFilters: (patch: Partial<ProblemsListParams>) => void;
};

type AnswerHistoryItem = {
  questionId: string;
  value: string;
  label: string;
};

const StudyPlanAdvisorDialog = ({
  open,
  onClose,
  studyPlans,
  currentFilters,
  onApplyFilters,
}: StudyPlanAdvisorDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerHistory, setAnswerHistory] = useState<AnswerHistoryItem[]>([]);
  const [previewPlanId, setPreviewPlanId] = useState<number | null>(null);

  const { data, error, isLoading, mutate } = useRecommendationResolve(
    open
      ? {
          answers,
          currentFilters,
        }
      : undefined,
  );

  useEffect(() => {
    if (!open) {
      setAnswers({});
      setAnswerHistory([]);
      setPreviewPlanId(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || data?.status !== 'result' || !data.directProblemId) {
      return;
    }

    navigate(getResourceById(resources.Problem, data.directProblemId));
    setAnswers({});
    setAnswerHistory([]);
    setPreviewPlanId(null);
    onClose();
  }, [data, navigate, onClose, open]);

  const suggestedPlan = useMemo(
    () =>
      data?.status === 'result' && data.suggestedStudyPlanId
        ? studyPlans.find((item) => item.id === data.suggestedStudyPlanId)
        : undefined,
    [data, studyPlans],
  );

  const primaryResult = data?.status === 'result' ? data.primary : undefined;

  const handleClose = () => {
    setAnswers({});
    setAnswerHistory([]);
    setPreviewPlanId(null);
    onClose();
  };

  const handleAnswer = (questionId: string, value: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setAnswerHistory((prev) => [
      ...prev.filter((item) => item.questionId !== questionId),
      { questionId, value, label },
    ]);
  };

  const handleBack = () => {
    const lastAnswer = answerHistory[answerHistory.length - 1];
    if (!lastAnswer) {
      handleClose();
      return;
    }

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[lastAnswer.questionId];
      return next;
    });
    setAnswerHistory((prev) => prev.slice(0, -1));
  };

  const handleApply = () => {
    if (!primaryResult) return;
    onApplyFilters(primaryResult.filterPatch);
    handleClose();
  };

  const handleOpenPlan = () => {
    const studyPlanId = data?.status === 'result' ? data.suggestedStudyPlanId : undefined;
    if (!studyPlanId) return;

    if (suggestedPlan?.isPurchased) {
      navigate(getResourceById(resources.StudyPlan, studyPlanId));
      handleClose();
      return;
    }

    setPreviewPlanId(studyPlanId);
  };

  const progressValue = data?.progress.percent ?? 0;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('problems.recommendation.title')}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          <LinearProgress
            variant={isLoading && !data ? 'indeterminate' : 'determinate'}
            value={progressValue}
            sx={{ borderRadius: 999 }}
          />

          {error ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => void mutate()}>
                  {t('problems.attempts.refresh')}
                </Button>
              }
            >
              {t('problems.detail.error')}
            </Alert>
          ) : null}

          {!data && isLoading ? (
            <Stack spacing={1}>
              <Typography variant="h6">{t('problems.recommendation.title')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('problems.emptySubtitle')}
              </Typography>
            </Stack>
          ) : null}

          {data?.status === 'question' ? (
            <>
              <div>
                <Typography variant="h6">{data.question.title}</Typography>
                {data.question.subtitle ? (
                  <Typography variant="body2" color="text.secondary" mt={0.75}>
                    {data.question.subtitle}
                  </Typography>
                ) : null}
              </div>

              <Stack spacing={1.25}>
                {data.question.options.map((option) => (
                  <Card key={option.id} variant="outlined" sx={{ borderRadius: 2.5 }}>
                    <CardActionArea
                      onClick={() => handleAnswer(data.question.id, option.id, option.label)}
                      sx={{
                        px: 2,
                        py: 1.75,
                        textAlign: 'left',
                        alignItems: 'stretch',
                      }}
                    >
                      <Stack alignItems="flex-start" spacing={0.35}>
                        <Typography variant="subtitle2" color="text.primary">
                          {option.label}
                        </Typography>
                        {option.helper ? (
                          <Typography variant="body2" color="text.secondary">
                            {option.helper}
                          </Typography>
                        ) : null}
                      </Stack>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </>
          ) : null}

          {data?.status === 'result' ? (
            <Stack spacing={2.5}>
              <Card variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {data.why}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} mt={1.5}>
                  {data.primary.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.75}>
                  {data.primary.subtitle}
                </Typography>
                {suggestedPlan ? (
                  <Typography variant="body2" mt={1.5}>
                    {t('problems.recommendation.planSuggestion', { title: suggestedPlan.title })}
                  </Typography>
                ) : null}
              </Card>
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={answerHistory.length === 0 ? handleClose : handleBack} color="inherit">
          {t('common.back')}
        </Button>
        {data?.status === 'result' && data.suggestedStudyPlanId ? (
          <Button onClick={handleOpenPlan} color="inherit">
            {t('problems.recommendation.openPlan')}
          </Button>
        ) : null}
        {data?.status === 'result' && !data.directProblemId ? (
          <Button onClick={handleApply} variant="contained" disabled={!primaryResult}>
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
