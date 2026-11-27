import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Dialog, DialogContent, LinearProgress } from '@mui/material';
import { getAttemptDetails } from 'modules/problems/application/queries';
import { AttemptDetail, AttemptListItem } from 'modules/problems/domain/entities/problem.entity';
import DialogHeader from 'shared/components/common/DialogHeader';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import AttemptJudgeSummaryCard from './AttemptJudgeSummaryCard';

interface AttemptProtocolDialogProps {
  open: boolean;
  attempt: AttemptListItem | null;
  onClose: () => void;
}

const AttemptProtocolDialog = ({ open, attempt, onClose }: AttemptProtocolDialogProps) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loadedDetail, setDetail] = useState<AttemptDetail | null>(null);
  const [failedAttemptId, setFailedAttemptId] = useState<number | null>(null);
  const attemptId = open && attempt?.canView && !attempt.judgeSummary ? attempt.id : undefined;
  const { run } = useScopedAsyncTask(attemptId ? `protocol:${attemptId}` : 'closed');
  const detail = loadedDetail?.id === attemptId ? loadedDetail : null;
  const baseAttempt = detail ?? attempt;
  const loadFailed = failedAttemptId === attemptId;
  const isLoading = Boolean(attemptId && !detail && !loadFailed);

  const fetchDetail = useCallback(() => {
    setFailedAttemptId(null);
    if (!attemptId) return;
    void run(() => getAttemptDetails(attemptId), {
      onSuccess: setDetail,
      onError: () => setFailedAttemptId(attemptId),
    });
  }, [attemptId, run]);

  useEffect(() => {
    setDetail(null);
    fetchDetail();
  }, [fetchDetail]);

  const handleRetry = () => {
    contentRef.current?.focus({ preventScroll: true });
    fetchDetail();
  };

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
        subtitle={`#${attempt.id} ${attempt.problemTitle ?? ''}`}
        onClose={onClose}
      />
      <DialogContent dividers ref={contentRef} tabIndex={-1} aria-busy={isLoading}>
        {isLoading ? (
          <LinearProgress aria-label={t('common.loading')} />
        ) : loadFailed ? (
          <Alert severity="error" action={<Button onClick={handleRetry}>{t('common.retry')}</Button>}>
            {t('problems.attempts.modal.loadError')}
          </Alert>
        ) : baseAttempt?.judgeSummary ? (
          <AttemptJudgeSummaryCard summary={baseAttempt.judgeSummary} balls={baseAttempt.balls} />
        ) : (
          <Alert severity="info">{t('problems.attempts.modal.noJudgeSummary')}</Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttemptProtocolDialog;
