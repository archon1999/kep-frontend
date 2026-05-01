import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import AttemptJudgeSummaryCard from './AttemptJudgeSummaryCard';
import { problemsQueries } from '../../application/queries';
import { AttemptDetail, AttemptListItem } from '../../domain/entities/problem.entity';

interface AttemptProtocolDialogProps {
  open: boolean;
  attempt: AttemptListItem | null;
  onClose: () => void;
}

const AttemptProtocolDialog = ({
  open,
  attempt,
  onClose,
}: AttemptProtocolDialogProps) => {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseAttempt = detail ?? attempt;

  const fetchDetail = useCallback(async () => {
    if (!attempt?.id || attempt?.judgeSummary || !attempt.canView) {
      setDetail(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await problemsQueries.problemsRepository.getAttempt(attempt.id);
      setDetail(data);
    } catch (error: any) {
      const fallbackMessage = t('problems.attempts.modal.loadError');
      const message = error?.response?.data?.message ?? error?.message ?? fallbackMessage;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [attempt, t]);

  useEffect(() => {
    if (open) {
      fetchDetail();
    } else {
      setDetail(null);
      setIsLoading(false);
    }
  }, [fetchDetail, open]);

  if (!attempt) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack spacing={0.25}>
            <Typography variant="h6" fontWeight={700}>
              {t('problems.attempts.modal.testingProtocol')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              #{baseAttempt?.id} {baseAttempt?.problemTitle ?? ''}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
        {baseAttempt?.judgeSummary ? (
          <AttemptJudgeSummaryCard summary={baseAttempt.judgeSummary} balls={baseAttempt.balls} />
        ) : (
          !isLoading && (
            <Alert severity="info">{t('problems.attempts.modal.noJudgeSummary')}</Alert>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttemptProtocolDialog;
