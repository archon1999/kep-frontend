import { useMemo } from 'react';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { setPendingTaskSlug } from 'modules/kepcoin/lib/pending-task-storage';
import { useStartTask, useVerifyTask } from 'modules/kepcoin/application/mutations';
import type { OneTimeTask } from 'modules/kepcoin/domain/entities/kepcoin.entity';

interface TaskActionDialogProps {
  open: boolean;
  task: OneTimeTask | null;
  onClose: () => void;
  onCompleted: () => Promise<void>;
}

const providerIconMap: Record<string, string> = {
  'connect-telegram': 'logos:telegram',
  'connect-google': 'logos:google-icon',
  'connect-github': 'logos:github-icon',
  'complete-bio': 'solar:document-text-bold-duotone',
  'upload-avatar': 'solar:user-circle-bold-duotone',
  'add-three-technologies': 'solar:code-square-bold-duotone',
  'add-codeforces-handle': 'solar:hashtag-circle-bold-duotone',
  'follow-user': 'solar:users-group-rounded-bold-duotone',
  'create-or-join-team': 'solar:users-group-two-rounded-bold-duotone',
  'subscribe-telegram-channel': 'solar:chat-round-bold-duotone',
  'first-problem-attempt': 'solar:play-circle-bold-duotone',
  'first-problem-ac': 'solar:medal-ribbon-star-bold-duotone',
  'register-contest': 'solar:cup-star-bold-duotone',
  'join-arena': 'solar:bolt-circle-bold-duotone',
  'complete-course-lesson-part': 'solar:book-bold-duotone',
  'first-project-attempt': 'solar:folder-with-files-bold-duotone',
  'leave-order-review': 'solar:chat-square-like-bold-duotone',
};

const TaskActionDialog = ({ open, task, onClose, onCompleted }: TaskActionDialogProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { trigger: startTask, isMutating: isStarting } = useStartTask();
  const { trigger: verifyTask, isMutating: isVerifying } = useVerifyTask();

  const taskIcon = useMemo(() => {
    if (!task) {
      return 'solar:checklist-bold-duotone';
    }

    return providerIconMap[task.slug] ?? 'solar:checklist-bold-duotone';
  }, [task]);

  const dialogCopy = useMemo(() => {
    const instructionContent = task?.instructionContent;
    const subtitle = instructionContent?.subtitle;
    const hint = instructionContent?.hint;
    const resolvedSteps = Array.isArray(instructionContent?.steps)
      ? instructionContent.steps.filter((step) => typeof step === 'string' && step.trim().length > 0)
      : [];

    return {
      subtitle,
      hint,
      steps: resolvedSteps,
      startLabel: t('kepcoinPage.tasks.start'),
    };
  }, [task, t]);

  const resolveTaskUrl = (url?: string) => {
    if (!url) {
      return '';
    }

    return url.replace('{username}', currentUser?.username ?? '');
  };

  const handleStart = async () => {
    if (!task) {
      return;
    }

    try {
      const result = await startTask(task.slug);
      if (!result?.url) {
        toast.error(t('kepcoinPage.tasks.errors.startFailed'));
        return;
      }

      const resolvedUrl = resolveTaskUrl(result.url);
      if (!resolvedUrl) {
        toast.error(t('kepcoinPage.tasks.errors.startFailed'));
        return;
      }

      if (result.actionType === 'redirect' || result.actionType === 'internal_link') {
        setPendingTaskSlug(task.slug);
        window.location.assign(resolvedUrl);
        return;
      }

      window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
      toast.success(t('kepcoinPage.tasks.startOpened'));
    } catch {
      toast.error(t('kepcoinPage.tasks.errors.startFailed'));
    }
  };

  const handleVerify = async () => {
    if (!task) {
      return;
    }

    try {
      const result = await verifyTask(task.slug);
      if (result.status === 'completed') {
        toast.success(t('kepcoinPage.tasks.verified'));
        await onCompleted();
        onClose();
        return;
      }

      if (result.status === 'already_completed') {
        toast.success(t('kepcoinPage.tasks.alreadyCompleted'));
        await onCompleted();
        onClose();
        return;
      }

      const key = `kepcoinPage.tasks.verifyCodes.${result.code}`;
      const fallback = t('kepcoinPage.tasks.errors.verifyFailed');
      const message = t(key);
      toast.error(message === key ? fallback : message);
    } catch {
      toast.error(t('kepcoinPage.tasks.errors.verifyFailed'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconifyIcon icon={taskIcon} fontSize={26} />
        <Stack direction="column" spacing={0.5}>
          <Typography variant="h6">{task?.title}</Typography>
          {dialogCopy.subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {dialogCopy.subtitle}
            </Typography>
          ) : null}
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="column" spacing={2.5}>
          {dialogCopy.hint ? <Alert severity="info">{dialogCopy.hint}</Alert> : null}

          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
            <KepcoinValue
              value={task?.reward ?? 0}
              iconSize={18}
              spacing={0.75}
              textVariant="body1"
              fontWeight={700}
            />
            {task?.status === 'completed' ? (
              <Chip color="success" label={t('kepcoinPage.tasks.completed')} />
            ) : (
              <Chip color="primary" variant="soft" label={t('kepcoinPage.tasks.pending')} />
            )}
          </Stack>

          <Divider />

          {task?.description ? (
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{t('kepcoinPage.tasks.description')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
            </Stack>
          ) : null}

          {dialogCopy.steps.length > 0 ? (
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{t('kepcoinPage.tasks.flowTitle')}</Typography>
              {dialogCopy.steps.map((step) => (
                <Typography key={step} variant="body2" color="text.secondary">
                  {step}
                </Typography>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>
          {t('kepcoinPage.tasks.close')}
        </Button>
        <Button onClick={handleStart} variant="outlined" disabled={!task || isStarting}>
          {task?.actionLabel || dialogCopy.startLabel}
        </Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={!task || isVerifying || task?.status === 'completed'}
        >
          {t('kepcoinPage.tasks.verify')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskActionDialog;
