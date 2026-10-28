import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { Arena, ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import { ChapterLogos } from 'shared/components/common/ChapterLogo';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { diffDateTime, formatCountdownClock } from 'shared/lib/dateTime';

interface CountdownCardProps {
  arena?: Arena;
}

interface CountdownView {
  label: string;
  progress: number;
  timerLabel: string;
  showProgress: boolean;
  color: 'warning' | 'success' | 'info';
}

const ArenaCountdownCard = ({ arena }: CountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (arena?.status == null || arena.status === ArenaStatus.Finished) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [arena?.status]);

  const { label, progress, timerLabel, showProgress, color } = useMemo<CountdownView>(() => {
    if (!arena) {
      return {
        label: '',
        progress: 0,
        timerLabel: '00:00:00',
        showProgress: false,
        color: 'warning',
      };
    }

    if (arena.status === ArenaStatus.NotStarted) {
      const remaining = diffDateTime(arena.startTime, now, 'millisecond');
      return {
        label: t('arena.countdown.untilStart'),
        progress: 0,
        timerLabel: formatCountdownClock(remaining),
        showProgress: false,
        color: 'warning',
      };
    }

    if (arena.status === ArenaStatus.Already) {
      const total = diffDateTime(arena.finishTime, arena.startTime, 'millisecond');
      const remaining = diffDateTime(arena.finishTime, now, 'millisecond');
      return {
        label: t('arena.countdown.untilFinish'),
        progress: Math.min(100, Math.max(0, 100 - (remaining / total) * 100)),
        timerLabel: formatCountdownClock(remaining),
        showProgress: true,
        color: 'success',
      };
    }

    return {
      label: t('arena.countdown.finished'),
      progress: 100,
      timerLabel: '00:00:00',
      showProgress: false,
      color: 'info',
    };
  }, [arena, now, t]);

  const headerTitle = arena?.title ?? t('arena.title');

  return (
    <PageHeader
      title={headerTitle}
      backTo={resources.Arena}
      actionComponent={
        <Stack gap={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
            {arena?.chapters?.length ? (
              <ChapterLogos chapters={arena.chapters} label={t('arena.chaptersLabel')} />
            ) : null}
            {label && arena?.status !== ArenaStatus.Finished && (
              <Chip label={label} size="small" variant="status" color={color} />
            )}
          </Stack>
          {arena && arena.status !== ArenaStatus.Finished && (
            <Typography variant="metric" aria-label={label} sx={{ fontSize: 28, lineHeight: 1.2 }}>
              {timerLabel}
            </Typography>
          )}
          {showProgress && (
            <LinearProgress
              aria-label={label}
              value={progress}
              variant="determinate"
              color={color}
              sx={{ width: 180, maxWidth: '100%', height: 4 }}
            />
          )}
        </Stack>
      }
    />
  );
};

export default ArenaCountdownCard;
