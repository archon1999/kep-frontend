import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
import { getColor } from 'shared/lib/echart-utils';
import { useUserRatings } from '../../../application/queries';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

const withPadding = (values: number[]) => {
  if (!values.length) return [0, 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const padding = range * 0.1;
  return [Math.max(0, min - padding), max + padding];
};

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

  const difficultyEntries = useMemo(() => {
    const difficulties = problemsRating?.difficulties;
    if (!difficulties) return [];
    return difficultyOptions
      .map((option) => {
        const totalKey =
          `all${option.key.charAt(0).toUpperCase()}${option.key.slice(1)}` as keyof typeof difficulties;
        return {
          key: option.key,
          value: difficulties[option.key],
          total: difficulties[totalKey],
          color: difficultyColorByKey[option.key],
        };
      })
      .filter((entry) => (entry.value ?? 0) > 0 || (entry.total ?? 0) > 0);
  }, [problemsRating?.difficulties]);

  const contestRatingOption = useMemo(() => {
    const changes = contestRatingChanges ?? [];
    if (!changes.length) return null;

    const sorted = [...changes].sort(
      (a, b) =>
        dayjs(a.contestStartDate ?? a.contestTitle ?? '').valueOf() -
        dayjs(b.contestStartDate ?? b.contestTitle ?? '').valueOf(),
    );

    const values = sorted.map((item) => Number(item.newRating ?? 0));
    const [min, max] = withPadding(values);

    return {
      color: [getColor(theme.vars.palette.primary.main)],
      grid: { left: 8, right: 12, top: 12, bottom: 12, containLabel: true },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: number) => value?.toString?.() ?? '',
      },
      xAxis: {
        type: 'category',
        data: sorted.map((item) =>
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
          areaStyle: { opacity: 0.18 },
          data: sorted.map((item) => ({
            value: item.newRating ?? 0,
            contestId: item.contestId,
            rank: item.rank,
            delta: item.delta,
          })),
        },
      ],
    };
  }, [contestRatingChanges, theme.vars.palette]);

  const challengeRatingOption = useMemo(() => {
    const changes = challengeRatingChanges ?? [];
    if (!changes.length) return null;

    const sorted = [...changes].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
    const values = sorted.map((item) => Number(item.value ?? 0));
    const [min, max] = withPadding(values);

    return {
      color: [getColor(theme.vars.palette.warning.main)],
      grid: { left: 8, right: 12, top: 12, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: sorted.map((item) => dayjs(item.date).format('DD MMM')),
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
          areaStyle: { opacity: 0.18 },
          data: sorted.map((item) => item.value ?? 0),
        },
      ],
    };
  }, [challengeRatingChanges, theme.vars.palette]);

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

  const contestMaxRating = useMemo(() => {
    if (!contestRatingChanges?.length) return undefined;
    return Math.max(...contestRatingChanges.map((item) => Number(item.newRating ?? 0)));
  }, [contestRatingChanges]);

  const contestLatestRating =
    contestsRating?.value ?? contestRatingChanges?.[contestRatingChanges.length - 1]?.newRating;

  return (
    <Stack direction="column" spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="column" spacing={2}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <KepIcon name="problems" fontSize={22} color="primary.main" />
                    <Typography variant="h6" fontWeight={800}>
                      {t('problems.title')}
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    color="primary"
                    label={`${t('users.profile.ratings.solved')}: ${problemsRating?.solved ?? 0}`}
                    variant="outlined"
                  />
                </Stack>

                {isProblemsLoading ? (
                  <Stack direction="column" spacing={1.5}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" height={22} />
                    <Skeleton variant="rectangular" height={22} />
                    <Skeleton variant="rectangular" height={80} />
                  </Stack>
                ) : problemsRating ? (
                  <Stack direction="column" spacing={1.5}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        size="small"
                        color="primary"
                        label={`${t('users.profile.ratings.rating')}: ${problemsRating.rating ?? '¢?"'}`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${t('users.profile.ratings.rank')}: #${problemsRating.rank ?? '¢?"'}`}
                        variant="outlined"
                      />
                      {problemsRating.difficulties?.totalProblems ? (
                        <Chip
                          size="small"
                          label={t('problems.difficultyOverview', {
                            solved: problemsRating.difficulties.totalSolved,
                            total: problemsRating.difficulties.totalProblems,
                          })}
                          variant="outlined"
                        />
                      ) : null}
                    </Stack>

                    <Stack direction="column" spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="difficulty" fontSize={18} color="text.secondary" />
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('problems.difficultyBreakdown')}
                        </Typography>
                      </Stack>

                      <Stack direction="column" spacing={1}>
                        {difficultyEntries.map((entry) => {
                          const percent = entry.total
                            ? Math.min(100, (entry.value / entry.total) * 100)
                            : 0;
                          return (
                            <Stack key={entry.key} direction="column" spacing={0.5}>
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography variant="body2" color="text.secondary">
                                  {t(`problems.difficulty.${entry.key}` as const)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {entry.value ?? 0}/{entry.total ?? 0}
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={percent}
                                sx={{
                                  height: 8,
                                  borderRadius: 999,
                                }}
                              />
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Stack>

                    <Divider />

                    <Button
                      component={RouterLink}
                      to={getResourceByUsername(resources.AttemptsByUser, username)}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {t('problems.attempts.title')}
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('users.emptyValue')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="column" spacing={2}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <KepIcon name="contests" fontSize={22} color="primary.main" />
                    <Typography variant="h6" fontWeight={800}>
                      {t('contests.title')}
                    </Typography>
                  </Stack>
                  {contestsRating?.title ? (
                    <ContestsRatingChip title={contestsRating.title} imgSize={28} withTitle />
                  ) : null}
                </Stack>

                {isRatingsLoading ? (
                  <Stack direction="column" spacing={1.25}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="rectangular" height={18} />
                    <Skeleton variant="rectangular" height={120} />
                  </Stack>
                ) : contestsRating ? (
                  <Stack direction="column" spacing={1.5}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        size="small"
                        color="primary"
                        label={`${t('users.profile.ratings.rating')}: ${contestLatestRating ?? '¢?"'}`}
                        variant="outlined"
                      />
                      {contestMaxRating ? (
                        <Chip
                          size="small"
                          label={`${t('users.profile.ratings.maxRating')}: ${contestMaxRating}`}
                          variant="outlined"
                        />
                      ) : null}
                      {contestsRating.rank !== undefined ? (
                        <Chip size="small" label={`#${contestsRating.rank}`} variant="outlined" />
                      ) : null}
                      {contestsRating.percentile !== undefined ? (
                        <Chip
                          size="small"
                          label={t('users.profile.ratings.percentile', {
                            value: contestsRating.percentile,
                          })}
                          variant="outlined"
                        />
                      ) : null}
                    </Stack>

                    <Stack direction="column" spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="rating-changes" fontSize={18} color="text.secondary" />
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('contests.statistics.ratingChangesHistory')}
                        </Typography>
                      </Stack>

                      {isContestChangesLoading ? (
                        <Skeleton variant="rectangular" height={160} />
                      ) : contestRatingOption ? (
                        <ReactEchart
                          echarts={echarts}
                          option={contestRatingOption}
                          onEvents={contestChartEvents}
                          sx={{ height: 200 }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('users.profile.ratings.noHistory')}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('users.emptyValue')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="column" spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <KepIcon name="challenges" fontSize={22} color="warning.main" />
                    <Typography variant="h6" fontWeight={800}>
                      {t('challenges.title')}
                    </Typography>
                  </Stack>
                  {challengesRating?.rankTitle ? (
                    <ChallengesRatingChip title={challengesRating.rankTitle} />
                  ) : null}
                </Stack>

                {isChallengesLoading ? (
                  <Stack direction="column" spacing={1.25}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" height={18} />
                    <Skeleton variant="rectangular" height={18} />
                  </Stack>
                ) : challengesRating ? (
                  <Stack direction="column" spacing={1.5}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        size="small"
                        color="warning"
                        label={`${t('users.profile.ratings.rating')}: ${challengesRating.rating}`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={t('users.profile.ratings.games', { total: challengesRating.all })}
                        variant="outlined"
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Tooltip title={t('users.profile.ratings.wins')} arrow>
                        <Chip label={`W ${challengesRating.wins}`} size="small" color="success" />
                      </Tooltip>
                      <Tooltip title={t('users.profile.ratings.draws')} arrow>
                        <Chip label={`D ${challengesRating.draws}`} size="small" color="default" />
                      </Tooltip>
                      <Tooltip title={t('users.profile.ratings.losses')} arrow>
                        <Chip label={`L ${challengesRating.losses}`} size="small" color="error" />
                      </Tooltip>
                    </Stack>

                    <Stack direction="column" spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="rating-changes" fontSize={18} color="text.secondary" />
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('challenges.ratingChanges')}
                        </Typography>
                      </Stack>

                      {isChallengeChangesLoading ? (
                        <Skeleton variant="rectangular" height={160} />
                      ) : challengeRatingOption ? (
                        <ReactEchart
                          echarts={echarts}
                          option={challengeRatingOption}
                          sx={{ height: 200 }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('users.profile.ratings.noHistory')}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('users.emptyValue')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserProfileRatingsTab;
