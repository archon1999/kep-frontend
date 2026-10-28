import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useContestsUserStatisticsPage } from 'modules/contests/application/hooks/useContestsUserStatisticsPage';
import {
  ContestUserStatisticsContestDeltaEntry,
  ContestUserStatisticsTopAttempt,
  ContestUserStatisticsUnsolvedProblem,
} from 'modules/contests/domain/entities/contest-user-statistics.entity';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import type { KepIconName } from 'shared/config/icons';
import useChartPalette from 'shared/hooks/useChartPalette';
import { getColor } from 'shared/lib/echart-utils';
import ContestRatingChangesChart from '../../shared/components/ContestRatingChangesChart';
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

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LegacyGridContainLabel,
  BarChart,
  PieChart,
  CanvasRenderer,
]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

const ContestsUserStatisticsPage = () => {
  const {
    statistics,
    isLoading,
    error,
    mutate,
    username,
    contestRankCardsFormatted,
    numberFormatter,
    formatDeltaCard,
  } = useContestsUserStatisticsPage();

  const { t } = useTranslation();
  const palette = useChartPalette();

  const axisLabelColor = getColor(palette.text.secondary);
  const neutralColor = getColor(palette.text.disabled);
  const primaryColor = getColor(palette.primary.main);
  const successColor = getColor(palette.success.main);
  const errorColor = getColor(palette.error.main);
  const infoColor = getColor(palette.info.main);
  const warningColor = getColor(palette.warning.main);

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
        value: overview.averageAttemptsPerProblem.toFixed(2),
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
            borderColor: getColor(palette.background.paper),
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
      palette.background.paper,
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

  const renderAttemptsList = (attempts: ContestUserStatisticsTopAttempt[], emptyText: string) => (
    <Stack direction="column" spacing={1.5}>
      {attempts.map((attempt) => (
        <Stack
          key={`${attempt.contestId}-${attempt.problemSymbol}`}
          direction="column"
          spacing={0.5}
          sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider', minWidth: 0 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>
              {attempt.problemSymbol}
            </Typography>
            <Chip
              label={
                attempt.solved ? t('contests.statistics.solved') : t('contests.statistics.unsolved')
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
          sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider', minWidth: 0 }}
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
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5, py: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
            >
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
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const renderContent = () => {
    if (isLoading)
      return (
        <StatisticsSection>
          <LinearProgress aria-label={t('common.loading')} />
        </StatisticsSection>
      );
    if (error)
      return (
        <Alert
          severity="error"
          sx={{ m: 'var(--kep-content-inset)' }}
          action={
            <Button color="inherit" onClick={() => void mutate()}>
              {t('common.statistics.retry')}
            </Button>
          }
        >
          {t('common.statistics.error')}
        </Alert>
      );
    if (!statistics)
      return (
        <StatisticsSection>
          <Typography color="text.secondary">{t('contests.statistics.noData')}</Typography>
        </StatisticsSection>
      );
    return (
      <Stack spacing={0}>
        <Grid container spacing={0}>
          {generalCards.map((card) => (
            <Grid key={card.label} size={{ xs: 6, md: 3 }}>
              <ContestsUserStatisticsPageStatCard {...card} />
            </Grid>
          ))}
        </Grid>
        <StatisticsSection title={t('contests.statistics.ratingChangesHistory')}>
          <ContestRatingChangesChart username={username} height={300} />
        </StatisticsSection>
        <Grid container spacing={0}>
          {overviewCards.map((card) => (
            <Grid key={card.label} size={{ xs: 6, md: 3 }}>
              <ContestsUserStatisticsPageStatCard {...card} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={0}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.attemptsTimeline')}
              option={timelineOption}
              emptyText={t('contests.statistics.noData')}
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
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.verdictDistribution')}
              option={verdictsOption}
              emptyText={t('contests.statistics.noData')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.tags')}
              option={tagsOption}
              emptyText={t('contests.statistics.noData')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContestsUserStatisticsPageChartCard
              title={t('contests.statistics.symbols')}
              option={symbolsOption}
              emptyText={t('contests.statistics.noData')}
            />
          </Grid>
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
          {highlightCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, md: 4 }}>
              <ContestsUserStatisticsPageHighlightCard {...card} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 6 }}>
            <StatisticsSection title={t('contests.statistics.unsolvedProblems')}>
              {renderUnsolvedProblems(
                statistics.unsolvedProblems,
                t(
                  !statistics.overview?.totalAttempts && !statistics.contestRanks?.best
                    ? 'contests.statistics.noContestHistory'
                    : 'contests.statistics.noUnsolvedProblems',
                ),
              )}
            </StatisticsSection>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatisticsSection title={t('contests.statistics.topAttempts')}>
              {renderAttemptsList(statistics.topAttempts, t('contests.statistics.noData'))}
            </StatisticsSection>
          </Grid>
        </Grid>
        {statistics.worthyOpponents.length > 0 && (
          <StatisticsSection title={t('contests.statistics.worthyOpponents')}>
            {renderOpponents(statistics.worthyOpponents)}
          </StatisticsSection>
        )}
      </Stack>
    );
  };
  return (
    <FramedPage>
      <PageHeader
        title={t('contests.statistics.title')}
        subtitle={t('contests.statistics.subtitle', { username })}
        backTo={resources.Contests}
      />
      {renderContent()}
    </FramedPage>
  );
};

export default ContestsUserStatisticsPage;
