import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useTranslation } from 'react-i18next';
import { Hackathon, HackathonStatus } from '../../domain/entities/hackathon.entity';

dayjs.extend(duration);

interface HackathonCountdownCardProps {
  hackathon?: Hackathon;
}

const formatDuration = (diffMs: number) => {
  const d = dayjs.duration(Math.max(diffMs, 0));
  const hours = String(Math.floor(d.asHours())).padStart(2, '0');
  const minutes = String(d.minutes()).padStart(2, '0');
  const seconds = String(d.seconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const HackathonCountdownCard = ({ hackathon }: HackathonCountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { label, progress, timerLabel } = useMemo(() => {
    if (!hackathon?.startTime || !hackathon.finishTime) {
      return { label: '', progress: 0, timerLabel: '00:00:00' };
    }

    const start = dayjs(hackathon.startTime);
    const finish = dayjs(hackathon.finishTime);

    if (hackathon.status === HackathonStatus.NOT_STARTED || start.isAfter(now)) {
      const total = finish.diff(start, 'millisecond');
      const remaining = start.diff(now, 'millisecond');
      return {
        label: t('hackathons.startsIn'),
        progress: total ? Math.min(100, Math.max(0, 100 - (remaining / total) * 100)) : 0,
        timerLabel: formatDuration(remaining),
      };
    }

    if (hackathon.status === HackathonStatus.ALREADY && finish.isAfter(now)) {
      const total = finish.diff(start, 'millisecond');
      const remaining = finish.diff(now, 'millisecond');
      return {
        label: t('hackathons.endsIn'),
        progress: total ? Math.min(100, Math.max(0, 100 - (remaining / total) * 100)) : 0,
        timerLabel: formatDuration(remaining),
      };
    }

    return { label: t('hackathons.finished'), progress: 100, timerLabel: '00:00:00' };
  }, [hackathon, now, t]);

  if (!hackathon) return null;

  return (
    <Card sx={{ borderRadius: 3, outline: 'none' }} background={1}>
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
            color={hackathon.status === HackathonStatus.ALREADY ? 'success' : 'warning'}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HackathonCountdownCard;
