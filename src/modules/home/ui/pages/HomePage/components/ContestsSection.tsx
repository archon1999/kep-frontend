import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  CardActionArea,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useContestsList } from 'modules/contests/application/queries';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';


dayjs.extend(duration);

interface HomeContestCardProps {
  contest: ContestListItem;
}

const HomeContestCard = ({ contest }: HomeContestCardProps) => {
  const { t } = useTranslation();

  const startDate = contest.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest.finishTime ? dayjs(contest.finishTime) : null;
  const now = dayjs();

  const isFinished = finishDate ? now.isAfter(finishDate) : false;
  const isUpcoming = startDate ? now.isBefore(startDate) : false;

  const statusLabel = isFinished
    ? t('contests.status.finished', { date: finishDate ? finishDate.format('DD MMM, HH:mm') : '—' })
    : isUpcoming
      ? t('contests.status.starts', { date: startDate ? startDate.format('DD MMM, HH:mm') : '—' })
      : t('contests.status.live', { date: finishDate ? finishDate.format('DD MMM, HH:mm') : '—' });

  const statusColor: 'success' | 'warning' | 'default' = isFinished
    ? 'default'
    : isUpcoming
      ? 'warning'
      : 'success';

  return (
    <CardActionArea
      component={RouterLink}
      to={getResourceById(resources.Contest, contest.id)}
      sx={{ display: 'block', borderRadius: 3, overflow: 'hidden' }}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          p: { xs: 3, sm: 3.5 },
          background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.info.mainChannel, 0.06)})`,
          borderRadius: 3,
          border: `1px solid ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.1)}`,
          overflow: 'hidden',
        })}
      >
        <Box
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 15% 20%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 38%), radial-gradient(circle at 85% 15%, ${cssVarRgba(theme.vars.palette.info.mainChannel, 0.08)}, transparent 42%)`,
            '&::after': contest.logo
              ? {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${contest.logo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.08,
                  filter: 'saturate(0.6)',
                }
              : undefined,
          })}
        />

        <Stack direction="column" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center" flex={1} minWidth={0}>
              <KepIcon name="contest" fontSize={20} />
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={800}
                textTransform="uppercase"
                noWrap
              >
                {contest.categoryTitle}
              </Typography>
              <Chip
                label={t(contest.isRated ? 'contests.rated' : 'contests.unrated')}
                size="small"
                color={contest.isRated ? 'secondary' : 'neutral'}
                variant={contest.isRated ? 'filled' : 'soft'}
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <Chip label={statusLabel} color={statusColor} variant="filled" sx={{ fontWeight: 700 }} />
          </Stack>

          <Stack direction="column" spacing={1}>
            <Typography variant="h6" fontWeight={800} sx={{ wordBreak: 'break-word' }}>
              {contest.title}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="challenge-time" fontSize={18} />
              <Typography variant="body2" color="text.secondary">
                {startDate
                  ? t('contests.startsLabel', { date: startDate.format('DD MMM, HH:mm') })
                  : t('contests.startsUnknown')}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="competition" fontSize={18} />
              <Typography variant="body2" color="text.secondary">
                {t('contests.type', { type: contest.type })}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:account-group" fontSize={18} />
              <Typography variant="body2" color="text.secondary">
                {t('contests.registrantsLabel', { count: contest.registrantsCount })}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </CardActionArea>
  );
};

const ContestsSection = () => {
  const { t } = useTranslation();
  const params = useMemo(() => ({ page: 1, page_size: 1 }), []);
  const { data, isLoading } = useContestsList(params);

  const latestContest = data?.data?.[0];

  return (
    <Paper>
      <Stack direction="column" spacing={2.5} sx={responsivePagePaddingSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t('homePage.contests.title')}
          </Typography>

          <Button
            variant="text"
            color="primary"
            component={RouterLink}
            to={resources.Contests}
          >
            {t('homePage.contests.viewAll')}
          </Button>
        </Stack>

        {isLoading ? (
          <Skeleton variant="rounded" height={196} />
        ) : latestContest ? (
          <HomeContestCard contest={latestContest} />
        ) : (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="mdi:calendar-blank" fontSize={22} color="text.disabled" />
            <Typography variant="body2" color="text.secondary">
              {t('homePage.contests.empty')}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default ContestsSection;
