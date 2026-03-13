import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useTranslation } from 'react-i18next';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

dayjs.extend(duration);

interface ArenaCountdownCardProps {
  arena?: Arena;
}

const formatDuration = (diffMs: number) => {
  const d = dayjs.duration(Math.max(diffMs, 0));
  const hours = String(d.hours()).padStart(2, '0');
  const minutes = String(d.minutes()).padStart(2, '0');
  const seconds = String(d.seconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const ArenaCountdownCard = ({ arena }: ArenaCountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { label, progress, timerLabel } = useMemo(() => {
    if (!arena) {
      return { label: '', progress: 0, timerLabel: '00:00:00' };
    }

    if (arena.status === ArenaStatus.NotStarted) {
      const start = dayjs(arena.startTime);
      const total = start.diff(dayjs(arena.startTime).subtract(arena.timeSeconds, 'second'), 'millisecond');
      const remaining = start.diff(now, 'millisecond');
      return {
        label: t('arena.countdown.untilStart'),
        progress: Math.min(100, Math.max(0, 100 - (remaining / total) * 100)),
        timerLabel: formatDuration(remaining),
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
      };
    }

    return {
      label: t('arena.countdown.finished'),
      progress: 100,
      timerLabel: '00:00:00',
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
          <LinearProgress
            value={progress}
            variant="determinate"
            color={arena?.status === ArenaStatus.Already ? 'success' : 'warning'}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaCountdownCard;
