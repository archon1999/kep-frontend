import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import KepIcon from 'shared/components/base/KepIcon';
import { diffDateTime, formatDateTime, getCountdownParts } from 'shared/lib/dateTime';

const HackathonCountdownCard = ({ hackathon }: { hackathon?: Hackathon }) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());
  const hasSchedule = Boolean(hackathon?.startTime && hackathon.finishTime);
  const untilStart = diffDateTime(hackathon?.startTime, now, 'millisecond');
  const untilFinish = diffDateTime(hackathon?.finishTime, now, 'millisecond');
  const finished =
    hackathon?.status === HackathonStatus.FINISHED || (hasSchedule && untilFinish <= 0);
  const upcoming = !finished && untilStart > 0;
  const remaining = finished ? 0 : Math.max(0, upcoming ? untilStart : untilFinish);
  const { hours, minutes, seconds } = getCountdownParts(remaining);

  useEffect(() => {
    if (!hasSchedule || finished) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hasSchedule, finished]);

  if (!hackathon) return null;

  return (
    <Box component="section" sx={{ p: 3 }}>
      {hasSchedule ? (
        <Stack direction="column" spacing={2}>
          <Stack direction="row" gap={1} alignItems="center">
            <KepIcon name="timer" fontSize={18} color="primary.main" />
            <Typography variant="label" color="text.secondary">
              {t(
                finished
                  ? 'hackathons.finished'
                  : upcoming
                    ? 'hackathons.startsIn'
                    : 'hackathons.endsIn',
              )}
            </Typography>
          </Stack>
          {!finished && (
            <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
              {[
                { value: hours, label: t('contests.timeLabels.hour') },
                { value: minutes, label: t('contests.timeLabels.minute') },
                { value: seconds, label: t('contests.timeLabels.second') },
              ].map((item) => (
                <Stack
                  key={item.label}
                  direction="column"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    px: 1,
                    py: 1.5,
                    minWidth: 60,
                    flex: 1,
                    bgcolor: 'background.level1',
                  }}
                >
                  <Typography
                    variant="metric"
                    fontSize={32}
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
          <Typography variant="body2" color="text.secondary">
            {t(
              upcoming
                ? 'contests.startsLabel'
                : finished
                  ? 'contests.countdownCard.finishedAt'
                  : 'contests.endsLabel',
              {
                date: formatDateTime(
                  upcoming ? hackathon.startTime : hackathon.finishTime,
                  'compactDateTime',
                ),
              },
            )}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('hackathons.noSchedule')}
        </Typography>
      )}
    </Box>
  );
};

export default HackathonCountdownCard;
