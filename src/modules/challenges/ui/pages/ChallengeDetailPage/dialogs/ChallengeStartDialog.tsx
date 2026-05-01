import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { Challenge } from 'modules/challenges/domain';
import ChallengeUserChip from 'modules/challenges/ui/shared/components/ChallengeUserChip.tsx';
import KepIcon from 'shared/components/base/KepIcon.tsx';

type StartDialogProps = {
  open: boolean;
  challenge: Challenge;
  timerModeLabel: string;
  starting: boolean;
  onStart: () => void | Promise<void>;
};

const ChallengeStartDialog = ({
  open,
  challenge,
  timerModeLabel,
  starting,
  onStart,
}: StartDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={() => undefined}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(10, 16, 24, 0.72)',
            backdropFilter: 'blur(6px)',
          },
        },
      }}
    >
      <DialogContent sx={{ py: 4 }}>
        <Stack spacing={2.5}>
          <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.lighter', color: 'primary.main' }}>
              <KepIcon name="challenge-time" fontSize={24} color="primary.main" />
            </Avatar>
            <Typography variant="h5" fontWeight={900}>
              {t('challenges.startDialogTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.startDialogSubtitle')}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Chip
              label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')}
              variant="outlined"
            />
            <Chip label={t('challenges.timeLimitShort', { seconds: challenge.timeSeconds })} />
            <Chip label={t('challenges.questionsCount', { count: challenge.questionsCount })} />
            <Chip label={timerModeLabel} />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <ChallengeUserChip player={challenge.playerFirst} />
            <Typography variant="h6" fontWeight={900} color="primary.main">
              VS
            </Typography>
            <ChallengeUserChip player={challenge.playerSecond} align="right" />
          </Stack>

          <Stack direction="row" justifyContent="center">
            <Button variant="contained" onClick={() => void onStart()} disabled={starting}>
              {t('challenges.start')}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeStartDialog;
