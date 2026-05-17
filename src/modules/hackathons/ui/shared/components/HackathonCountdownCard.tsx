import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import { diffDateTime, formatCountdownClock } from 'shared/lib/dateTime';
import { formatHackathonDateTime } from '../helpers/format';

interface HackathonCountdownCardProps {
  hackathon?: Hackathon;
}

const HackathonCountdownCard = ({ hackathon }: HackathonCountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { label, progress, timerLabel } = useMemo(() => {
    if (!hackathon?.startTime || !hackathon.finishTime) {
      return { label: '', progress: 0, timerLabel: '00:00:00' };
    }

    if (hackathon.status === HackathonStatus.NOT_STARTED || diffDateTime(hackathon.startTime, now) > 0) {
      const total = diffDateTime(hackathon.finishTime, hackathon.startTime, 'millisecond');
      const remaining = diffDateTime(hackathon.startTime, now, 'millisecond');
      return {
        label: t('hackathons.startsIn'),
        progress: total ? Math.min(100, Math.max(0, 100 - (remaining / total) * 100)) : 0,
        timerLabel: formatCountdownClock(remaining),
      };
    }

    if (hackathon.status === HackathonStatus.ALREADY && diffDateTime(hackathon.finishTime, now) > 0) {
      const total = diffDateTime(hackathon.finishTime, hackathon.startTime, 'millisecond');
      const remaining = diffDateTime(hackathon.finishTime, now, 'millisecond');
      return {
        label: t('hackathons.endsIn'),
        progress: total ? Math.min(100, Math.max(0, 100 - (remaining / total) * 100)) : 0,
        timerLabel: formatCountdownClock(remaining),
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

          <Divider />

          <Stack direction="column" spacing={1.25}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.startsAt')}
              </Typography>
              <Typography variant="body2" fontWeight={700} textAlign="right">
                {formatHackathonDateTime(hackathon.startTime)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.endsAt')}
              </Typography>
              <Typography variant="body2" fontWeight={700} textAlign="right">
                {formatHackathonDateTime(hackathon.finishTime)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HackathonCountdownCard;
