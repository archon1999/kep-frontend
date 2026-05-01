import { Alert, Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

interface ArenaQueueBannerProps {
  arena?: Arena;
  currentChallengeId?: number;
  onOpenCurrentChallenge?: () => Promise<void>;
  onPauseToggle?: () => Promise<void>;
}

const ENDING_SOON_MS = 2 * 60 * 1000;

const ArenaQueueBanner = ({
  arena,
  currentChallengeId,
  onOpenCurrentChallenge,
  onPauseToggle,
}: ArenaQueueBannerProps) => {
  const { t } = useTranslation();

  if (!arena || arena.status !== ArenaStatus.Already || !arena.isRegistrated) {
    return null;
  }

  const isEndingSoon = dayjs(arena.finishTime).diff(dayjs()) <= ENDING_SOON_MS;

  if (isEndingSoon) {
    return (
      <Alert
        severity="info"
        icon={<IconifyIcon icon="mdi:timer-sand" fontSize={20} />}
        action={
          currentChallengeId && onOpenCurrentChallenge ? (
            <Button color="inherit" size="small" onClick={onOpenCurrentChallenge}>
              {t('arena.actions.nextChallenge')}
            </Button>
          ) : undefined
        }
      >
        <Typography fontWeight={700}>{t('arena.queue.finishingSoon')}</Typography>
      </Alert>
    );
  }

  if (arena.pause) {
    return (
      <Alert
        severity="warning"
        icon={<IconifyIcon icon="mdi:pause-circle-outline" fontSize={20} />}
        action={
          onPauseToggle ? (
            <Button color="inherit" size="small" variant="outlined" onClick={onPauseToggle}>
              {t('arena.actions.start')}
            </Button>
          ) : undefined
        }
      >
        <Typography fontWeight={700}>{t('arena.queue.paused')}</Typography>
      </Alert>
    );
  }

  return (
    <Alert
      severity="success"
      icon={<IconifyIcon icon="mdi:play-circle-outline" fontSize={20} />}
      action={
        <Stack direction="row" spacing={1}>
          {currentChallengeId && onOpenCurrentChallenge ? (
            <Button color="inherit" size="small" variant="outlined" onClick={onOpenCurrentChallenge}>
              {t('arena.actions.nextChallenge')}
            </Button>
          ) : null}
          {onPauseToggle ? (
            <Button color="inherit" size="small" variant="outlined" onClick={onPauseToggle}>
              {t('arena.actions.pause')}
            </Button>
          ) : null}
        </Stack>
      }
    >
      <Typography fontWeight={700}>{t('arena.queue.active')}</Typography>
    </Alert>
  );
};

export default ArenaQueueBanner;
