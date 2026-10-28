import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dialog, DialogContent, LinearProgress } from '@mui/material';
import { getAttemptDetails } from 'modules/problems/application/queries';
import { AttemptDetail, AttemptListItem } from 'modules/problems/domain/entities/problem.entity';
import DialogHeader from 'shared/components/common/DialogHeader';
import { toast } from 'sonner';
import AttemptJudgeSummaryCard from './AttemptJudgeSummaryCard';

interface AttemptProtocolDialogProps {
  open: boolean;
  attempt: AttemptListItem | null;
  onClose: () => void;
}

const AttemptProtocolDialog = ({ open, attempt, onClose }: AttemptProtocolDialogProps) => {
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
      const data = await getAttemptDetails(attempt.id);
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="attempt-protocol-title"
    >
      <DialogHeader
        id="attempt-protocol-title"
        title={t('problems.attempts.modal.testingProtocol')}
        subtitle={`#${baseAttempt?.id} ${baseAttempt?.problemTitle ?? ''}`}
        onClose={onClose}
      />
      <DialogContent dividers>
        {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
        {baseAttempt?.judgeSummary ? (
          <AttemptJudgeSummaryCard summary={baseAttempt.judgeSummary} balls={baseAttempt.balls} />
        ) : (
          !isLoading && <Alert severity="info">{t('problems.attempts.modal.noJudgeSummary')}</Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttemptProtocolDialog;
