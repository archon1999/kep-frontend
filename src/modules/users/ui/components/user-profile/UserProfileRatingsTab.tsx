import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  useChallengeRatingChanges,
  useChallengeUserRating,
} from 'modules/challenges/application/queries';
import { useContestRatingChanges } from 'modules/contests/application/queries';
import { useUserProblemsRating } from 'modules/problems/application/queries';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import KepIcon from 'shared/components/base/KepIcon';
import ReactEchart from 'shared/components/base/ReactEchart';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { KepIconName } from 'shared/config/icons';
import { getColor } from 'shared/lib/echart-utils';
import { useUserRatings } from '../../../application/queries';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer]);

const integerAxisLabelFormatter = (value: number | string) => Math.round(Number(value)).toString();

const withPadding = (values: number[]) => {
  if (!values.length) return [0, 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const padding = range * 0.1;
  return [Math.max(0, min - padding), max + padding];
};

const formatDelta = (delta?: number) => {
  if (delta === undefined) return undefined;
  return delta > 0 ? `+${delta}` : `${delta}`;
};

const RatingHeader = ({
  icon,
  title,
  children,
}: {
  icon: KepIconName;
  title: string;
  children?: ReactNode;
}) => (
  <Box
    sx={(theme) => ({
      px: 2,
      py: 1.5,
      borderBottom: 1,
      borderColor: 'divider',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(
        theme.palette.primary.main,
        0.04,
      )})`,
    })}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.25}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar
          variant="rounded"
          sx={(theme) => ({
            width: 40,
            height: 40,
            borderRadius: '8px',
            bgcolor: alpha(theme.palette.primary.main, 0.14),
            color: 'primary.main',
          })}
        >
          <KepIcon name={icon} fontSize={24} />
        </Avatar>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
      </Stack>

      {children ? (
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
          {children}
        </Stack>
      ) : null}
    </Stack>
  </Box>
);

const LoadingCard = () => (
  <Card variant="outlined" sx={{ borderRadius: '8px' }}>
    <CardContent sx={{ py: 5 }}>
      <Stack direction="column" spacing={1.5} alignItems="center">
        <Skeleton variant="circular" width={42} height={42} />
        <Skeleton variant="text" width="42%" />
        <Skeleton variant="rounded" width="78%" height={18} />
      </Stack>
    </CardContent>
  </Card>
);

const StatBadge = ({
  icon,
  label,
  color = 'primary',
}: {
  icon?: KepIconName;
  label: ReactNode;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default';
}) => (
  <Chip
    size="small"
    color={color}
    variant="outlined"
    label={
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon ? <KepIcon name={icon} fontSize={14} /> : null}
        <span>{label}</span>
      </Stack>
    }
  />
);

const UserProfileRatingsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: problemsRating, isLoading: isProblemsLoading } = useUserProblemsRating(username);
  const { data: challengesRating, isLoading: isChallengesLoading } =
    useChallengeUserRating(username);
  const { data: contestRatingChanges, isLoading: isContestChangesLoading } =
    useContestRatingChanges(username);
  const { data: challengeRatingChanges, isLoading: isChallengeChangesLoading } =
    useChallengeRatingChanges(username);

  const contestsRating = userRatings?.contestsRating;
  const emptyValue = t('users.emptyValue');

  const sortedContestChanges = useMemo(() => {
    const changes = contestRatingChanges ?? [];
    return [...changes].sort(
      (a, b) =>
        dayjs(a.contestStartDate ?? a.contestTitle ?? '').valueOf() -
        dayjs(b.contestStartDate ?? b.contestTitle ?? '').valueOf(),
    );
  }, [contestRatingChanges]);

  const sortedChallengeChanges = useMemo(() => {
    const changes = challengeRatingChanges ?? [];
    return [...changes].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  }, [challengeRatingChanges]);

  const difficultyEntries = useMemo(() => {
    const difficulties = problemsRating?.difficulties;
    if (!difficulties) return [];

    return difficultyOptions.map((option) => ({
      key: option.key,
      value: difficulties[option.key] ?? 0,
      color: difficultyColorByKey[option.key],
    }));
  }, [problemsRating?.difficulties]);

  const contestMaxChange = useMemo(() => {
    if (!sortedContestChanges.length) return undefined;
    return sortedContestChanges.reduce((best, item) =>
      Number(item.newRating ?? 0) > Number(best.newRating ?? 0) ? item : best,
    );
  }, [sortedContestChanges]);

  const contestLatestChange = sortedContestChanges[sortedContestChanges.length - 1];
  const contestLatestRating = contestsRating?.value ?? contestLatestChange?.newRating;
  const contestLatestTitle = contestsRating?.title ?? contestLatestChange?.newRatingTitle;
  const contestMaxRating = contestMaxChange?.newRating;
  const contestMaxTitle = contestMaxChange?.newRatingTitle ?? contestLatestTitle;

  const contestRatingOption = useMemo(() => {
    if (!sortedContestChanges.length) return null;

    const values = sortedContestChanges.map((item) => Number(item.newRating ?? 0));
    const [min, max] = withPadding(values);

    return {
      color: [getColor(theme.vars.palette.primary.main)],
      grid: { left: 8, right: 12, top: 12, bottom: 12, containLabel: true },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params?.[0]?.data;
          const change = sortedContestChanges[params?.[0]?.dataIndex];
          if (!change) return '';

          const delta = formatDelta(change.delta);
          return [
            change.contestTitle ?? '',
            `#${change.rank ?? emptyValue}`,
            `${username}: ${point?.value ?? emptyValue}`,
            delta ? `${t('users.profile.ratings.rating')}: ${delta}` : '',
          ]
            .filter(Boolean)
            .join('<br />');
        },
      },
      xAxis: {
        type: 'category',
        data: sortedContestChanges.map((item) =>
          item.contestStartDate
            ? dayjs(item.contestStartDate).format('DD MMM')
            : (item.contestTitle ?? ''),
        ),
        axisLabel: { color: getColor(theme.vars.palette.text.secondary) },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: getColor(theme.vars.palette.divider) } },
      },
      yAxis: {
        type: 'value',
        min,
        max,
        axisLabel: {
          color: getColor(theme.vars.palette.text.secondary),
          formatter: integerAxisLabelFormatter,
        },
        splitLine: { lineStyle: { color: getColor(theme.vars.palette.divider) } },
        minInterval: 1,
      },
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 8,
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.2 },
          data: sortedContestChanges.map((item) => ({
            value: item.newRating ?? 0,
            contestId: item.contestId,
          })),
        },
      ],
    };
  }, [emptyValue, sortedContestChanges, t, theme.vars.palette, username]);

  const challengeRatingOption = useMemo(() => {
    if (!sortedChallengeChanges.length) return null;

    const values = sortedChallengeChanges.map((item) => Number(item.value ?? 0));
    const [min, max] = withPadding(values);

    return {
      color: [getColor(theme.vars.palette.warning.main)],
      grid: { left: 8, right: 12, top: 12, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: sortedChallengeChanges.map((item) => dayjs(item.date).format('DD MMM')),
        axisLabel: { color: getColor(theme.vars.palette.text.secondary) },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: getColor(theme.vars.palette.divider) } },
      },
      yAxis: {
        type: 'value',
        min,
        max,
        axisLabel: {
          color: getColor(theme.vars.palette.text.secondary),
          formatter: integerAxisLabelFormatter,
        },
        splitLine: { lineStyle: { color: getColor(theme.vars.palette.divider) } },
        minInterval: 1,
      },
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 8,
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.2 },
          data: sortedChallengeChanges.map((item) => item.value ?? 0),
        },
      ],
    };
  }, [sortedChallengeChanges, theme.vars.palette]);

  const contestChartEvents = useMemo(
    () => ({
      click: (params: any) => {
        const contestId = params?.data?.contestId;
        if (contestId) {
          navigate(getResourceById(resources.ContestStandings, contestId));
        }
      },
    }),
    [navigate],
  );

  const isMainLoading = isProblemsLoading || isRatingsLoading || isChallengesLoading;

  if (isMainLoading) {
    return (
      <Stack direction="column" spacing={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <RatingHeader icon="problem" title={t('problems.title')}>
          <Tooltip title={t('users.profile.ratings.solved')} arrow>
            <span>
              <StatBadge icon="check" label={problemsRating?.solved ?? 0} color="success" />
            </span>
          </Tooltip>
          <Tooltip title={t('users.profile.ratings.rating')} arrow>
            <span>
              <StatBadge icon="rating" label={problemsRating?.rating ?? 0} />
            </span>
          </Tooltip>
        </RatingHeader>

        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
                md: `repeat(${Math.max(difficultyEntries.length, 1)}, minmax(0, 1fr))`,
              },
              gap: 1.5,
              textAlign: 'center',
            }}
          >
            {difficultyEntries.map((difficulty) => (
              <Box key={difficulty.key}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {t(`problems.difficulty.${difficulty.key}` as const)}
                </Typography>
                <Typography variant="h6" color={`${difficulty.color}.main`} fontWeight={800}>
                  {difficulty.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            component={RouterLink}
            to={getResourceByUsername(resources.AttemptsByUser, username)}
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
          >
            {t('problems.attempts.title')}
          </Button>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <RatingHeader icon="contests" title={t('contests.title')}>
          <Chip
            size="small"
            variant="outlined"
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ContestsRatingChip title={contestLatestTitle} imgSize={16} />
                <span>{contestLatestRating ?? 0}</span>
              </Stack>
            }
          />
          <Chip
            size="small"
            variant="outlined"
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ContestsRatingChip title={contestMaxTitle} imgSize={16} />
                <span>{contestMaxRating ?? 0}</span>
              </Stack>
            }
          />
          <StatBadge label={sortedContestChanges.length} />
        </RatingHeader>

        <CardContent>
          {isContestChangesLoading ? (
            <Skeleton variant="rectangular" height={260} />
          ) : contestRatingOption ? (
            <ReactEchart
              echarts={echarts}
              option={contestRatingOption}
              onEvents={contestChartEvents}
              sx={{ height: 300 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('users.profile.ratings.noHistory')}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <RatingHeader icon="challenges" title={t('challenges.title')}>
          <ChallengesRatingChip title={challengesRating?.rankTitle} />
          <ChallengesRatingChip
            title={challengesRating?.rankTitle}
            rating={challengesRating?.rating ?? 0}
          />
        </RatingHeader>

        <CardContent>
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 2 }}>
            <Tooltip title={t('users.profile.ratings.wins')} arrow>
              <Typography variant="h6" color="success.main" fontWeight={800}>
                W {challengesRating?.wins ?? 0}
              </Typography>
            </Tooltip>
            <Tooltip title={t('users.profile.ratings.draws')} arrow>
              <Typography variant="h6" color="text.secondary" fontWeight={800}>
                D {challengesRating?.draws ?? 0}
              </Typography>
            </Tooltip>
            <Tooltip title={t('users.profile.ratings.losses')} arrow>
              <Typography variant="h6" color="error.main" fontWeight={800}>
                L {challengesRating?.losses ?? 0}
              </Typography>
            </Tooltip>
          </Stack>

          {isChallengeChangesLoading ? (
            <Skeleton variant="rectangular" height={260} />
          ) : challengeRatingOption ? (
            <ReactEchart echarts={echarts} option={challengeRatingOption} sx={{ height: 300 }} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('users.profile.ratings.noHistory')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserProfileRatingsTab;
