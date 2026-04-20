import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { cssVarRgba } from 'shared/lib/utils';
import { Arena, ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';


const formatCountdownDuration = (diffMs: number) => {
  const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const getStatusColor = (status: ArenaStatus) => {
  if (status === ArenaStatus.Already) return 'success';
  if (status === ArenaStatus.Finished) return 'default';
  return 'warning';
};

interface ArenaListPageCardProps {
  arena: Arena;
}

const ArenaListPageCard = ({ arena }: ArenaListPageCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => dayjs());
  const statusColor = getStatusColor(arena.status);
  const isLive = arena.status === ArenaStatus.Already;
  const isUpcoming = arena.status === ArenaStatus.NotStarted;
  const isFinished = arena.status === ArenaStatus.Finished;

  useEffect(() => {
    if (!isUpcoming && !isLive) return undefined;

    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, [isLive, isUpcoming]);

  const statusLabel = useMemo(() => {
    if (arena.status === ArenaStatus.NotStarted) return t('arena.status.upcoming');
    if (arena.status === ArenaStatus.Already) return t('arena.status.live');
    return t('arena.status.finished');
  }, [arena.status, t]);

  const statusIcon = isLive
    ? 'mdi:broadcast'
    : isUpcoming
      ? 'mdi:calendar-clock'
      : 'mdi:flag-checkered';

  const countdown = useMemo(() => {
    if (isUpcoming) {
      return {
        label: t('arena.countdown.untilStart'),
        value: formatCountdownDuration(dayjs(arena.startTime).diff(now, 'millisecond')),
        icon: 'mdi:calendar-clock',
        color: 'warning.main',
      };
    }

    if (isLive) {
      return {
        label: t('arena.countdown.untilFinish'),
        value: formatCountdownDuration(dayjs(arena.finishTime).diff(now, 'millisecond')),
        icon: 'mdi:timer-sand',
        color: 'success.main',
      };
    }

    return null;
  }, [arena.finishTime, arena.startTime, isLive, isUpcoming, now, t]);

  const chapterIconBadges = arena.chapters?.map((chapter) => (
    <Tooltip key={chapter.id} title={chapter.title}>
      <Avatar
        src={chapter.icon}
        alt={chapter.title}
        sx={{
          width: 32,
          height: 32,
        }}
      >
        {chapter.title.slice(0, 1)}
      </Avatar>
    </Tooltip>
  ));

  return (
    <Card
      background={1}
      sx={(theme) => {
        const accentChannel = isLive
          ? theme.vars.palette.success.mainChannel
          : isUpcoming
            ? theme.vars.palette.warning.mainChannel
            : theme.vars.palette.text.primaryChannel;
        const accentColor = isLive
          ? theme.vars.palette.success.main
          : isUpcoming
            ? theme.vars.palette.warning.main
            : theme.vars.palette.text.disabled;

        return {
          position: 'relative',
          outline: 'none',
          borderRadius: 2,
          overflow: 'hidden',
          opacity: isFinished ? 0.82 : 1,
          border: `1px solid ${cssVarRgba(accentChannel, isFinished ? 0.1 : 0.28)}`,
          boxShadow: isFinished ? 'none' : `0 10px 28px ${cssVarRgba(accentChannel, 0.12)}`,
          background: isFinished
            ? undefined
            : `linear-gradient(135deg, ${cssVarRgba(accentChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.96)})`,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0 auto 0 0',
            width: 4,
            bgcolor: accentColor,
            opacity: isFinished ? 0.32 : 0.92,
          },
        };
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.ArenaTournament, arena.id)}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', lg: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Box
                sx={(theme) => ({
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  bgcolor: cssVarRgba(
                    isLive
                      ? theme.vars.palette.success.mainChannel
                      : isUpcoming
                        ? theme.vars.palette.warning.mainChannel
                        : theme.vars.palette.text.primaryChannel,
                    isFinished ? 0.06 : 0.14,
                  ),
                  color: isLive ? 'success.main' : isUpcoming ? 'warning.main' : 'text.secondary',
                })}
              >
                <IconifyIcon icon={statusIcon} fontSize={24} />
              </Box>

              <Stack direction="column" spacing={0.75} sx={{ minWidth: 0 }}>
                <Typography variant="h6" fontWeight={900} sx={{ wordBreak: 'break-word' }}>
                  {arena.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Chip color={statusColor} size="small" label={statusLabel} />
                  <Chip
                    color="warning"
                    size="small"
                    icon={<IconifyIcon icon="mdi:alarm" fontSize={16} />}
                    label={`${arena.timeSeconds}s`}
                  />
                  {chapterIconBadges}
                </Stack>
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
              sx={{ flexShrink: 0 }}
            >
              {countdown ? (
                <>
                  <Stack direction="column" spacing={0.25}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {countdown.label}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <IconifyIcon icon={countdown.icon} color={countdown.color} fontSize={18} />
                      <Typography variant="subtitle2" fontFamily="monospace" fontWeight={900}>
                        {countdown.value}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  />
                </>
              ) : null}
              <Stack direction="column" spacing={0.25}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {t('arena.timeline.start')}
                </Typography>
                <Typography variant="subtitle2" fontWeight={900}>
                  {dayjs(arena.startTime).format('DD MMM, HH:mm')}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', sm: 'block' } }}
              />
              <Stack direction="column" spacing={0.25}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {t('arena.questions')}
                </Typography>
                <Typography variant="subtitle2" fontWeight={900}>
                  {arena.questionsCount}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArenaListPageCard;
