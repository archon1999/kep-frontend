import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Card, CardContent, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaHighlight } from '../../domain/entities/arena-highlight.entity.ts';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';
import ArenaHighlightBanner from './ArenaHighlightBanner.tsx';

interface ArenaCountdownCardProps {
  arena?: Arena;
  highlight?: ArenaHighlight;
}

interface CountdownView {
  label: string;
  progress: number;
  timerLabel: string;
  showProgress: boolean;
  color: 'warning' | 'success' | 'info';
}

const formatDuration = (diffMs: number) => {
  const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const TimeSegment = ({ value }: { value: string }) => (
  <Box
    sx={(theme) => ({
      minWidth: { xs: 58, sm: 70, md: 82 },
      px: { xs: 1, sm: 1.5 },
      py: { xs: 1, sm: 1.25 },
      borderRadius: 1,
      border: '1px solid',
      borderColor: alpha(theme.palette.warning.main, 0.28),
      background: alpha(theme.palette.warning.main, 0.12),
      boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.46)}`,
      textAlign: 'center',
      backdropFilter: 'blur(8px)',
    })}
  >
    <Typography
      component="span"
      fontFamily="monospace"
      fontWeight={900}
      color="text.primary"
      sx={{ fontSize: { xs: 28, sm: 34, md: 40 }, lineHeight: 1 }}
    >
      {value}
    </Typography>
  </Box>
);

const ArenaCountdownCard = ({ arena, highlight }: ArenaCountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      const start = dayjs(arena.startTime);
      const remaining = start.diff(now, 'millisecond');
      return {
        label: t('arena.countdown.untilStart'),
        progress: 0,
        timerLabel: formatDuration(remaining),
        showProgress: false,
        color: 'warning',
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
        color: 'success',
      };
    }

    return {
      label: t('arena.countdown.finished'),
      progress: 100,
      timerLabel: '00:00:00',
      showProgress: true,
      color: 'info',
    };
  }, [arena, now, t]);

  const [hours, minutes, seconds] = timerLabel.split(':');
  const headerTitle = arena?.title ?? t('arena.title');
  const chapterPreview = arena?.chapters?.slice(0, 4) ?? [];

  return (
    <Card
      sx={{
        outline: 'none',
        borderRadius: 4,
        background:
          arena?.status === ArenaStatus.Already
            ? 'linear-gradient(135deg, rgba(46,125,50,0.18), rgba(255,193,7,0.12))'
            : arena?.status === ArenaStatus.Finished
              ? 'linear-gradient(135deg, rgba(255,193,7,0.18), rgba(84,110,122,0.10))'
              : 'linear-gradient(120deg, rgba(255,193,7,0.16), rgba(33,150,243,0.08))',
      }}
      background={1}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2.5}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="column" spacing={1.5} sx={{ flex: { md: 1 }, minWidth: 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
              <IconifyIcon
                icon={arena?.status === ArenaStatus.Finished ? 'mdi:trophy-award' : 'mdi:sword-cross'}
                color="warning.main"
                fontSize={34}
              />
              <Typography variant="h4" fontWeight={900} color="text.primary" noWrap>
                {headerTitle}
              </Typography>
            </Stack>

            {chapterPreview.length ? (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                {chapterPreview.map((chapter) => (
                  <Tooltip key={chapter.id} title={chapter.title}>
                    <Avatar
                      src={chapter.icon}
                      alt={chapter.title}
                      sx={{
                        width: 36,
                        height: 36,
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            ) : null}
          </Stack>

          <ArenaHighlightBanner highlight={highlight} />

          <Stack
            direction="column"
            spacing={1.5}
            alignItems={{ xs: 'stretch', md: 'flex-end' }}
            sx={{ flex: { md: 1 }, minWidth: 0 }}
          >
            <Typography variant="subtitle2" fontWeight={800} color="text.secondary" textAlign={{ md: 'right' }}>
              {label}
            </Typography>
            <Stack
              direction="row"
              spacing={{ xs: 0.5, sm: 0.75 }}
              alignItems="center"
              justifyContent="flex-end"
            >
              <TimeSegment value={hours} />
              <Typography
                fontFamily="monospace"
                fontWeight={900}
                color="text.primary"
                sx={{ fontSize: 30 }}
              >
                :
              </Typography>
              <TimeSegment value={minutes} />
              <Typography
                fontFamily="monospace"
                fontWeight={900}
                color="text.primary"
                sx={{ fontSize: 30 }}
              >
                :
              </Typography>
              <TimeSegment value={seconds} />
            </Stack>
            {showProgress ? (
              <LinearProgress
                value={progress}
                variant="determinate"
                color={color}
                sx={(theme) => ({
                  width: '100%',
                  minWidth: { md: 300 },
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette[color].main, 0.16),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                  },
                })}
              />
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaCountdownCard;
