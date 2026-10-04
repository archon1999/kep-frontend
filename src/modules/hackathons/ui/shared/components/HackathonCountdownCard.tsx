import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import KepIcon from 'shared/components/base/KepIcon';
import { diffDateTime, formatDateTime, getCountdownParts } from 'shared/lib/dateTime';
import { cssVarRgba } from 'shared/lib/utils';

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
  const color = finished ? 'default' : upcoming ? 'warning' : 'success';

  useEffect(() => {
    if (!hasSchedule || finished) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hasSchedule, finished]);

  if (!hackathon) return null;

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        color: 'text.primary',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 58%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04)})`,
        borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12),
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 14% 18%, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.16)}, transparent 34%), radial-gradient(circle at 85% 14%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 28%)`,
        })}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        {hasSchedule ? (
          <Stack direction="column" spacing={2}>
            <Stack direction="row" justifyContent="center">
              <Chip
                icon={<KepIcon name="timer" fontSize={16} />}
                label={t(
                  finished
                    ? 'hackathons.finished'
                    : upcoming
                      ? 'hackathons.startsIn'
                      : 'hackathons.endsIn',
                )}
                color={color}
                variant="filled"
                sx={{
                  color: finished ? 'text.primary' : 'primary.contrastText',
                  bgcolor: finished ? 'background.paper' : undefined,
                  fontWeight: 700,
                }}
              />
            </Stack>
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
                  sx={(theme) => ({
                    px: 2,
                    py: 1.5,
                    minWidth: 72,
                    borderRadius: 2,
                    background: theme.vars.palette.background.paper,
                    boxShadow: `0 10px 40px ${theme.palette.common.black}0a`,
                    color: theme.vars.palette.text.primary,
                  })}
                >
                  <Typography
                    variant="h4"
                    fontWeight={800}
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
            <Typography align="center" variant="caption" fontWeight={500}>
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
      </CardContent>
    </Card>
  );
};

export default HackathonCountdownCard;
