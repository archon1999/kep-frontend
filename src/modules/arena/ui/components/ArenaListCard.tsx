import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Card, CardActionArea, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

interface ArenaListCardProps {
  arena: Arena;
}

const formatDurationMinutes = (start: string, finish: string) => {
  const startTime = dayjs(start);
  const finishTime = dayjs(finish);
  return Math.max(finishTime.diff(startTime, 'minute'), 0);
};

const ArenaListCard = ({ arena }: ArenaListCardProps) => {
  const { t } = useTranslation();

  const durationMinutes = useMemo(
    () => formatDurationMinutes(arena.startTime, arena.finishTime),
    [arena.finishTime, arena.startTime],
  );

  const statusLabel = useMemo(() => {
    if (arena.status === ArenaStatus.NotStarted) return t('arena.status.upcoming');
    if (arena.status === ArenaStatus.Already) return t('arena.status.live');
    return t('arena.status.finished');
  }, [arena.status, t]);

  return (
    <Card background={1} sx={{ outline: 'none', borderRadius: 3 }}>
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.ArenaTournament, arena.id)}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack direction="column" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconifyIcon icon="mdi:sword-cross" color="warning.main" fontSize={28} />
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  {arena.title}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip
                  color="warning"
                  variant="outlined"
                  size="small"
                  label={`${durationMinutes} ${t('arena.minutes')}`}
                />
                <Chip
                  variant="outlined"
                  color="warning"
                  size="small"
                  icon={<IconifyIcon icon="mdi:alarm" fontSize={16} />}
                  label={`${arena.timeSeconds}s`}
                />
                <Chip
                  variant="outlined"
                  color="warning"
                  size="small"
                  icon={<IconifyIcon icon="mdi:help-circle-outline" fontSize={16} />}
                  label={`${arena.questionsCount} ${t('arena.questions')}`}
                />
                {arena.chapters?.map((chapter) => (
                  <Chip
                    key={chapter.id}
                    size="small"
                    variant="soft"
                    color="primary"
                    label={chapter.title}
                  />
                ))}
              </Stack>
            </Stack>

            <Stack direction="column" alignItems="flex-end" spacing={1}>
              <Chip
                label={statusLabel}
                color={
                  arena.status === ArenaStatus.Already
                    ? 'success'
                    : arena.status === ArenaStatus.Finished
                      ? 'default'
                      : 'warning'
                }
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="column" spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('arena.timeline.start')}
              </Typography>
              <Typography fontWeight={700}>
                {dayjs(arena.startTime).format('DD MMM, HH:mm')}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('arena.timeline.finish')}
              </Typography>
              <Typography fontWeight={700}>
                {dayjs(arena.finishTime).format('DD MMM, HH:mm')}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArenaListCard;
