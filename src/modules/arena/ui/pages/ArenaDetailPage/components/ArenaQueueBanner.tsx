import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { arenaQueries } from 'modules/arena/application/queries.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Arena, ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';

interface QueueBannerProps {
  arena?: Arena;
  arenaId?: string | number;
  currentChallengeId?: number;
  onChanged?: () => Promise<void>;
}

const ENDING_SOON_MS = 2 * 60 * 1000;

const ArenaQueueBanner = ({
  arena,
  arenaId,
  currentChallengeId,
  onChanged,
}: QueueBannerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  if (!arena || arena.status !== ArenaStatus.Already || !arena.isRegistrated) {
    return null;
  }

  const isEndingSoon = dayjs(arena.finishTime).diff(dayjs()) <= ENDING_SOON_MS;

  const handleOpenCurrentChallenge = async () => {
    if (!arenaId) return;

    setIsLoadingAction(true);
    try {
      const result = await arenaQueries.arenaRepository.loadNextChallenge(arenaId);
      const challengeId = result?.challengeId ?? currentChallengeId;

      if (challengeId) {
        navigate(`${getResourceById(resources.Challenge, challengeId)}?arena=${arenaId}`);
      }
    } catch {
      toast.error(
        t('common.error', {
          defaultValue: 'Something went wrong',
        }),
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handlePauseToggle = async () => {
    if (!arenaId) return;

    setIsLoadingAction(true);
    try {
      if (arena.pause) {
        await arenaQueries.arenaRepository.start(arenaId);
      } else {
        await arenaQueries.arenaRepository.pause(arenaId);
      }
      await onChanged?.();
    } catch {
      toast.error(
        t('common.error', {
          defaultValue: 'Something went wrong',
        }),
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (isEndingSoon) {
    return (
      <Alert
        severity="info"
        icon={<IconifyIcon icon="mdi:timer-sand" fontSize={20} />}
        action={
          currentChallengeId ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => void handleOpenCurrentChallenge()}
              disabled={isLoadingAction}
            >
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
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            onClick={() => void handlePauseToggle()}
            disabled={isLoadingAction}
          >
            {t('arena.actions.start')}
          </Button>
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
          {currentChallengeId ? (
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={() => void handleOpenCurrentChallenge()}
              disabled={isLoadingAction}
            >
              {t('arena.actions.nextChallenge')}
            </Button>
          ) : null}
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            onClick={() => void handlePauseToggle()}
            disabled={isLoadingAction}
          >
            {t('arena.actions.pause')}
          </Button>
        </Stack>
      }
    >
      <Typography fontWeight={700}>{t('arena.queue.active')}</Typography>
    </Alert>
  );
};

export default ArenaQueueBanner;
