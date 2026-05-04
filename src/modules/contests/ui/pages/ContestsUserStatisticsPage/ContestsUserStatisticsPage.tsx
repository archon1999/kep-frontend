import { useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import {
  ContestUserStatisticsContestDeltaEntry,
  ContestUserStatisticsContestRankEntry,
  ContestUserStatisticsTopAttempt,
  ContestUserStatisticsUnsolvedProblem,
} from 'modules/contests/domain/entities/contest-user-statistics.entity';
import {
  useContestRatingChanges,
  useContestUserStatistics,
} from 'modules/contests/application/queries';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { getColor } from 'shared/lib/echart-utils';
import type { KepIconName } from 'shared/config/icons';
import ContestRatingChangesChartCard from '../../shared/components/ContestRatingChangesChartCard';
import ContestsUserStatisticsPageChartCard from './ContestsUserStatisticsPageChartCard.tsx';
import ContestsUserStatisticsPageHighlightCard, {
  type ContestsUserStatisticsPageHighlightCardProps,
} from './ContestsUserStatisticsPageHighlightCard.tsx';
import ContestsUserStatisticsPageRecordCard, {
  type ContestsUserStatisticsPageRecordItem,
} from './ContestsUserStatisticsPageRecordCard.tsx';
import ContestsUserStatisticsPageStatCard, {
  type ContestsUserStatisticsPageStatCardProps,
} from './ContestsUserStatisticsPageStatCard.tsx';

echarts.use([GridComponent, TooltipComponent, LegendComponent, BarChart, PieChart, CanvasRenderer]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

const ContestsUserStatisticsPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();

  const username = currentUser?.username;
  const { data: statistics, isLoading } = useContestUserStatistics(username);
  const { data: ratingChanges } = useContestRatingChanges(username);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }),
    [i18n.language],
  );

  const axisLabelColor = getColor(theme.vars.palette.text.secondary);
  const neutralColor = getColor(theme.vars.palette.text.disabled);
  const primaryColor = getColor(theme.vars.palette.primary.main);
  const successColor = getColor(theme.vars.palette.success.main);
  const errorColor = getColor(theme.vars.palette.error.main);
  const infoColor = getColor(theme.vars.palette.info.main);
  const warningColor = getColor(theme.vars.palette.warning.main);

  const generalCards = useMemo<ContestsUserStatisticsPageStatCardProps[]>(() => {
    if (!statistics?.general) return [];
    const general = statistics.general;
    return [
      {
        icon: 'rating',
        label: t('contests.statistics.currentRating'),
        value: numberFormatter.format(general.rating),
        subtitle: general.ratingTitle,
      },
      {
        icon: 'contest',
        label: t('contests.statistics.bestRating'),
        value: numberFormatter.format(general.maxRating),
        subtitle: general.maxRatingTitle,
      },
      {
        icon: 'statistics',
        label: t('contests.statistics.rank'),
        value: general.ratingPlace ? `#${general.ratingPlace}` : '—',
        subtitle: general.contestantsCount
          ? t('contests.statistics.outOf', {
              total: numberFormatter.format(general.contestantsCount),
            })
          : undefined,
      },
      {
        icon: 'users',
        label: t('contests.statistics.totalContestants'),
        value: numberFormatter.format(general.contestantsCount),
      },
    ];
  }, [numberFormatter, statistics?.general, t]);

  const overviewCards = useMemo<ContestsUserStatisticsPageStatCardProps[]>(() => {
    if (!statistics?.overview) return [];
    const overview = statistics.overview;
    return [
      {
        icon: 'attempt',
        label: t('contests.statistics.totalAttempts'),
        value: numberFormatter.format(overview.totalAttempts),
      },
      {
        icon: 'statistics',
        label: t('contests.statistics.totalAccepted'),
        value: numberFormatter.format(overview.totalAccepted),
      },
      {
        icon: 'statistics',
        label: t('contests.statistics.averageAttempts'),
        value: (overview.averageAttemptsPerProblem + 1).toFixed(2),
      },
      {
        icon: 'attempt',
        label: t('contests.statistics.singleAttempts'),
        value: numberFormatter.format(overview.singleAttemptProblems?.count ?? 0),
        subtitle:
          overview.singleAttemptProblems?.percentage != null
            ? `${overview.singleAttemptProblems.percentage.toFixed(2)}%`
            : undefined,
      },
    ];
  }, [numberFormatter, statistics?.overview, t]);

  const highlightCards = useMemo<ContestsUserStatisticsPageHighlightCardProps[]>(() => {
    const overview = statistics?.overview;
    return [
      {
        icon: 'attempt',
        label: t('contests.statistics.mostAttemptsProblem'),
        valueLabel: overview?.mostAttemptsProblem?.problemSymbol,
        meta: overview?.mostAttemptsProblem
          ? `${numberFormatter.format(overview.mostAttemptsProblem.attemptsCount)} ${t(
              'contests.statistics.attempts',
            )}`
          : undefined,
        contestTitle: overview?.mostAttemptsProblem?.contestTitle,
        contestLink: overview?.mostAttemptsProblem
          ? getResourceByParams(resources.ContestProblem, {
              id: overview.mostAttemptsProblem.contestId,
              symbol: overview.mostAttemptsProblem.problemSymbol,
            })
          : undefined,
      },
      {
        icon: 'statistics',
        label: t('contests.statistics.fastestSolve'),
        valueLabel: overview?.fastestSolve?.problemSymbol,
        meta: overview?.fastestSolve?.time,
        contestTitle: overview?.fastestSolve?.contestTitle,
        contestLink: overview?.fastestSolve
          ? getResourceByParams(resources.ContestProblem, {
              id: overview.fastestSolve.contestId,
              symbol: overview.fastestSolve.problemSymbol,
            })
          : undefined,
      },
      {
        icon: 'statistics',
        label: t('contests.statistics.slowestSolve'),
        valueLabel: overview?.slowestSolve?.problemSymbol,
        meta: overview?.slowestSolve?.time,
        contestTitle: overview?.slowestSolve?.contestTitle,
        contestLink: overview?.slowestSolve
          ? getResourceByParams(resources.ContestProblem, {
              id: overview.slowestSolve.contestId,
              symbol: overview.slowestSolve.problemSymbol,
            })
          : undefined,
      },
    ];
  }, [numberFormatter, statistics?.overview, t]);

  const contestRankCards = useMemo<
    {
      icon: KepIconName;
      label: string;
      entry: ContestUserStatisticsContestRankEntry | null | undefined;
      valueColor?: string;
    }[]
  >(
    () =>
      [
        {
          icon: 'contest' as KepIconName,
          label: t('contests.statistics.bestRank'),
          entry: statistics?.contestRanks?.best,
        },
        {
          icon: 'contest' as KepIconName,
          label: t('contests.statistics.toughestRank'),
          entry: statistics?.contestRanks?.worst,
        },
      ].map(({ entry, ...rest }) => ({
        ...rest,
        entry,
        valueColor: undefined as string | undefined,
      })),
    [statistics?.contestRanks, t],
  );

  const contestDeltaCards = useMemo<
    {
      icon: KepIconName;
      label: string;
      entry: ContestUserStatisticsContestDeltaEntry | null | undefined;
      valueColor?: string;
    }[]
  >(
    () =>
      [
        {
          icon: 'statistics' as KepIconName,
          label: t('contests.statistics.bestDelta'),
          entry: statistics?.contestDeltas?.best,
        },
        {
          icon: 'statistics' as KepIconName,
          label: t('contests.statistics.worstDelta'),
          entry: statistics?.contestDeltas?.worst,
        },
      ].map(({ entry, ...rest }) => ({
        ...rest,
        entry,
        valueColor:
          entry?.delta != null
            ? entry.delta > 0
              ? successColor
              : entry.delta < 0
                ? errorColor
                : undefined
            : undefined,
      })),
    [errorColor, statistics?.contestDeltas, successColor, t],
  );

  const formatRankCard = (card: {
    icon: KepIconName;
    label: string;
    entry: ContestUserStatisticsContestRankEntry | null | undefined;
    valueColor?: string;
  }) => ({
    ...card,
    value: card.entry ? `#${card.entry.rank}` : undefined,
    contestTitle: card.entry?.contestTitle,
    contestLink: card.entry?.contestId
      ? getResourceById(resources.Contest, card.entry.contestId)
      : undefined,
    subtitle: card.entry
      ? t('contests.statistics.participants', {
          total: numberFormatter.format(card.entry.participantsCount),
        })
      : undefined,
  });

  const formatDeltaCard = (card: {
    icon: KepIconName;
    label: string;
    entry: ContestUserStatisticsContestDeltaEntry | null | undefined;
    valueColor?: string;
  }) => ({
    ...card,
    value:
      card.entry?.delta != null
        ? `${card.entry.delta > 0 ? '+' : ''}${card.entry.delta}`
        : undefined,
    contestTitle: card.entry?.contestTitle,
    contestLink: card.entry?.contestId
      ? getResourceById(resources.Contest, card.entry.contestId)
      : undefined,
    subtitle: card.entry
      ? t('contests.statistics.participants', {
          total: numberFormatter.format(card.entry.participantsCount),
        })
      : undefined,
  });

  const contestRankCardsFormatted = contestRankCards.map(formatRankCard);
  const contestDeltaCardsFormatted = contestDeltaCards.map(formatDeltaCard);
  const contestRankRecordItems =
    contestRankCardsFormatted as ContestsUserStatisticsPageRecordItem[];
  const contestDeltaRecordItems =
    contestDeltaCardsFormatted as ContestsUserStatisticsPageRecordItem[];

  const timelineOption = useMemo(() => {
    const timeline = statistics?.timeline ?? [];
    if (!timeline.length) return null;
    return {
      color: [primaryColor],
      tooltip: {
        trigger: 'axis',
      },
      grid: { left: 8, right: 8, top: 12, bottom: 12, containLabel: true },
      xAxis: {
        type: 'category',
        data: timeline.map((item) => item.range),
        axisLabel: { color: axisLabelColor, interval: 0, rotate: 0 },
        axisLine: { lineStyle: { color: neutralColor } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: neutralColor } },
        minInterval: 1,
      },
      series: [
        {
          type: 'bar',
          data: timeline.map((item) => item.attempts),
          barWidth: '60%',
          itemStyle: { borderRadius: 6 },
        },
      ],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, neutralColor, primaryColor, statistics?.timeline]);

  const languagesOption = useMemo(() => {
    const languages = statistics?.languages ?? [];
    if (!languages.length) return null;
    return {
      color: [primaryColor],
      grid: { left: 8, right: 16, top: 12, bottom: 12, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: neutralColor } },
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: languages.map((lang) => lang.langFull),
        axisLabel: { color: axisLabelColor },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: languages.map((lang) => lang.attemptsCount),
          itemStyle: { borderRadius: 6 },
        },
      ],
    } satisfies EChartsCoreOption;
  }, [axisLabelColor, neutralColor, primaryColor, statistics?.languages]);

  const createDonutOption = useCallback(
    (entries: { name: string; value: number }[]) => ({
      color: [primaryColor, successColor, warningColor, errorColor, infoColor, neutralColor],
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        right: 8,
        top: 'center',
        textStyle: { color: axisLabelColor },
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['45%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: getColor(theme.vars.palette.background.paper),
            borderWidth: 2,
          },
          label: { show: false },
          labelLine: { show: false },
          data: entries,
        },
      ],
    }),
    [
      axisLabelColor,
      errorColor,
      infoColor,
      neutralColor,
      primaryColor,
      successColor,
      theme.vars.palette.background.paper,
      warningColor,
    ],
  );

  const verdictsOption = useMemo(() => {
    const verdicts = statistics?.verdicts ?? [];
    if (!verdicts.length) return null;
    const data = verdicts.map((item) => ({
      value: item.attemptsCount,
      name: t(`contests.verdicts.${item.verdict}` as const),
    }));
    return createDonutOption(data);
  }, [createDonutOption, statistics?.verdicts, t]);

  const tagsOption = useMemo(() => {
    const tags = statistics?.tags ?? [];
    if (!tags.length) return null;
    const data = tags.map((item) => ({ name: item.name, value: item.solved }));
    return createDonutOption(data);
  }, [createDonutOption, statistics?.tags]);

  const symbolsOption = useMemo(() => {
    const symbols = statistics?.symbols ?? [];
    if (!symbols.length) return null;
    const data = symbols.map((item) => ({ name: item.symbol, value: item.solved }));
    return createDonutOption(data);
  }, [createDonutOption, statistics?.symbols]);

  const renderAttemptsList = (
    attempts: ContestUserStatisticsTopAttempt[],
    emptyText: string,
  ) => (
    <Stack direction="column" spacing={1.5}>
      {attempts.map((attempt) => (
        <Stack
          key={`${attempt.contestId}-${attempt.problemSymbol}`}
          direction="column"
          spacing={0.5}
          sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>
              {attempt.problemSymbol}
            </Typography>
            <Chip
              label={
                attempt.solved
                  ? t('contests.statistics.solved')
                  : t('contests.statistics.unsolved')
              }
              size="small"
              color={attempt.solved ? 'success' : 'error'}
              variant="soft"
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('contests.statistics.attemptsCount', {
                count: attempt.attemptsCount,
              })}
            </Typography>
            <Button
              component={RouterLink}
              to={getResourceByParams(resources.ContestProblem, {
                id: attempt.contestId,
                symbol: attempt.problemSymbol,
              })}
              size="small"
              variant="text"
              sx={{ px: 0 }}
            >
              {attempt.contestTitle}
            </Button>
          </Stack>
        </Stack>
      ))}
      {!attempts.length ? (
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      ) : null}
    </Stack>
  );

  const renderUnsolvedProblems = (
    problems: ContestUserStatisticsUnsolvedProblem[],
    emptyText: string,
  ) => (
    <Stack direction="column" spacing={1.5}>
      {problems.map((problem) => (
        <Stack
          key={`${problem.contestId}-${problem.problemSymbol}`}
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {problem.problemSymbol}
          </Typography>
          <Button
            component={RouterLink}
            to={getResourceByParams(resources.ContestProblem, {
              id: problem.contestId,
              symbol: problem.problemSymbol,
            })}
            size="small"
            variant="text"
            sx={{ px: 0 }}
          >
            {problem.contestTitle}
          </Button>
        </Stack>
      ))}
      {!problems.length ? (
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      ) : null}
    </Stack>
  );

  const renderOpponents = (opponents: any[]) => (
    <Grid container spacing={2} alignItems="stretch">
      {opponents.map((opponent) => (
        <Grid key={opponent.opponent} size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ height: '100%', minHeight: 360, borderRadius: 3, display: 'flex' }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Typography variant="subtitle1" fontWeight={800}>
                  {opponent.opponent}
                </Typography>
                <Chip
                  label={t('contests.statistics.sharedContests', {
                    count: opponent.sharedCount,
                  })}
                  size="small"
                  color="primary"
                  variant="soft"
                />
              </Stack>
              <Typography variant="subtitle2" color="text.secondary">
                {opponent.type}
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {opponent.userWins} : {opponent.opponentWins}
              </Typography>
              <Divider />
              <Stack
                direction="column"
                spacing={1}
                sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}
              >
                {opponent.contests.map((contest: any) => (
                  <Stack key={contest.contestId} direction="column" spacing={0.5}>
                    <Button
                      component={RouterLink}
                      to={getResourceById(resources.Contest, contest.contestId)}
                      size="small"
                      variant="text"
                      sx={{ px: 0, justifyContent: 'flex-start' }}
                    >
                      {contest.contestTitle}
                    </Button>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="body2"
                        color={
                          contest.userRank < contest.opponentRank
                            ? 'success.main'
                            : contest.userRank === contest.opponentRank
                              ? 'text.secondary'
                              : 'error.main'
                        }
                      >
                        #{contest.userRank} ({contest.userPoints})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        vs
                      </Typography>
                      <Typography
                        variant="body2"
                        color={
                          contest.opponentRank < contest.userRank
                            ? 'success.main'
                            : contest.opponentRank === contest.userRank
                              ? 'text.secondary'
                              : 'error.main'
                        }
                      >
                        #{contest.opponentRank} ({contest.opponentPoints})
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
                {!opponent.contests.length ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.statistics.noData')}
                  </Typography>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Typography variant="body1">{t('contests.statistics.loading')}</Typography>
              <LinearProgress />
            </Stack>
          </CardContent>
        </Card>
      );
    }

    if (!statistics) {
      return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              {t('contests.statistics.noData')}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Stack direction="column" spacing={3}>
        <Typography variant="body1" color="text.secondary">
          {t('contests.statistics.subtitle', { username })}
        </Typography>

        <Grid container spacing={2}>
          {generalCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <ContestsUserStatisticsPageStatCard {...card} highlight />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          {overviewCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <ContestsUserStatisticsPageStatCard {...card} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          {highlightCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, md: 4 }}>
              <ContestsUserStatisticsPageHighlightCard {...card} />
            </Grid>
          ))}
        </Grid>

        <ContestRatingChangesChartCard
          title={t('contests.statistics.ratingChangesHistory')}
          changes={ratingChanges}
          username={username}
          emptyText={t('contests.statistics.noData')}
          height={360}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContestsUserStatisticsPageRecordCard
              title={t('contests.statistics.contestRanks')}
              items={contestRankRecordItems}
              emptyText={t('contests.statistics.noData')}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ContestsUserStatisticsPageRecordCard
              title={t('contests.statistics.ratingChanges')}
              items={contestDeltaRecordItems}
              emptyText={t('contests.statistics.noData')}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.attemptsTimeline')}
              option={timelineOption}
              emptyText={t('contests.statistics.noData')}
              height={340}
              extra={
                <Typography variant="body2" color="text.secondary">
                  {t('contests.statistics.attemptsCount', {
                    count: statistics.overview?.totalAttempts ?? 0,
                  })}
                </Typography>
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.languages')}
              option={languagesOption}
              emptyText={t('contests.statistics.noData')}
              height={340}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.verdictDistribution')}
              option={verdictsOption}
              emptyText={t('contests.statistics.noData')}
              height={320}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.tags')}
              option={tagsOption}
              emptyText={t('contests.statistics.noData')}
              height={320}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.symbols')}
              option={symbolsOption}
              emptyText={t('contests.statistics.noData')}
              height={320}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('contests.statistics.unsolvedProblems')}
                  </Typography>
                  {renderUnsolvedProblems(
                    statistics.unsolvedProblems,
                    t('contests.statistics.noUnsolvedProblems'),
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('contests.statistics.topAttempts')}
                  </Typography>
                  {renderAttemptsList(statistics.topAttempts, t('contests.statistics.noData'))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {statistics.worthyOpponents.length ? (
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="column" spacing={2}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('contests.statistics.worthyOpponents')}
                </Typography>
                {renderOpponents(statistics.worthyOpponents)}
              </Stack>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    );
  };

  return (
    <Stack direction="column" spacing={4} height={1}>
      <PageHeader
        title={t('contests.statistics.title')}
        breadcrumb={[
          { label: t('contests.title'), url: resources.Contests },
          { label: t('contests.tabs.statistics'), active: true },
        ]}
      />
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 } }}>
        {renderContent()}
      </Box>
    </Stack>
  );
};

export default ContestsUserStatisticsPage;
