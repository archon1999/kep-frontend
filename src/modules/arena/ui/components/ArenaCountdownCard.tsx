import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

interface ArenaCountdownCardProps {
  arena?: Arena;
}

const formatDuration = (diffMs: number) => {
  const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const ArenaCountdownCard = ({ arena }: ArenaCountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { label, progress, timerLabel, showProgress } = useMemo(() => {
    if (!arena) {
      return { label: '', progress: 0, timerLabel: '00:00:00', showProgress: false };
    }

    if (arena.status === ArenaStatus.NotStarted) {
      const start = dayjs(arena.startTime);
      const remaining = start.diff(now, 'millisecond');
      return {
        label: t('arena.countdown.untilStart'),
        progress: 0,
        timerLabel: formatDuration(remaining),
        showProgress: false,
      };
    }

    if (arena.status === ArenaStatus.Already) {
      const finish = dayjs(arena.finishTime);
      const start = dayjs(arena.startTime);
      const total = finish.diff(start, 'millisecond');
      const remaining = finish.diff(now, 'millisecond');
      return {
        label: t('arena.countdown.untilFinish'),
        progress: Math.min(100, Math.max(0, 100 - (remaining / total) * 100)),
        timerLabel: formatDuration(remaining),
        showProgress: true,
      };
    }

    return {
      label: t('arena.countdown.finished'),
      progress: 100,
      timerLabel: '00:00:00',
      showProgress: true,
    };
  }, [arena, now, t]);

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            {timerLabel}
          </Typography>
          {showProgress ? (
            <LinearProgress
              value={progress}
              variant="determinate"
              color={arena?.status === ArenaStatus.Already ? 'success' : 'warning'}
              sx={{ height: 10, borderRadius: 5 }}
            />
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaCountdownCard;
