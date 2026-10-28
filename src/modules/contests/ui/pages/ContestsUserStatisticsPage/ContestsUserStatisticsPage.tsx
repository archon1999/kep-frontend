import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, Stack, Typography } from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useContestsUserStatisticsPage } from 'modules/contests/application/hooks/useContestsUserStatisticsPage';
import { ContestUserStatisticsContestDeltaEntry } from 'modules/contests/domain/entities/contest-user-statistics.entity';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StatisticsBreakdown from 'shared/components/statistics/StatisticsBreakdown';
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
import ContestStatisticsOpponents from './components/ContestStatisticsOpponents';
import ContestStatisticsProblemList from './components/ContestStatisticsProblemList';
import ContestsStatisticsSkeleton from './components/ContestsStatisticsSkeleton';

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
        valueColor: getRankColor(general.ratingPlace, 'text.primary'),
        subtitle: general.contestantsCount
          ? t('contests.statistics.outOf', {
              total: numberFormatter.format(general.contestantsCount),
              count: general.contestantsCount,
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
        value: numberFormatter.format(overview.averageAttemptsPerProblem),
      },
      {
        icon: 'attempt',
        label: t('contests.statistics.singleAttempts'),
        value: numberFormatter.format(overview.singleAttemptProblems?.count ?? 0),
        subtitle:
          overview.singleAttemptProblems?.percentage != null
            ? `${numberFormatter.format(overview.singleAttemptProblems.percentage)}%`
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
          ? t('contests.statistics.attemptsCount', {
              count: overview.mostAttemptsProblem.attemptsCount,
            })
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
        axisLabel: { color: axisLabelColor, hideOverlap: true, rotate: 0 },
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
          itemStyle: { borderRadius: 0 },
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

  const renderContent = () => {
    if (isLoading) return <ContestsStatisticsSkeleton />;
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
          <ContestRatingChangesChart username={username} height={232} />
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
            <StatisticsSection title={t('contests.statistics.verdictDistribution')}>
              <StatisticsBreakdown
                label={t('contests.statistics.verdictDistribution')}
                items={(statistics.verdicts ?? []).map((item) => ({
                  label: t(`contests.verdicts.${item.verdict}`),
                  value: item.attemptsCount,
                  color:
                    item.verdict === 'AC'
                      ? successColor
                      : item.verdict === 'WA'
                        ? errorColor
                        : item.verdict === 'TLE'
                          ? warningColor
                          : neutralColor,
                }))}
              />
            </StatisticsSection>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatisticsSection title={t('contests.statistics.tags')}>
              <StatisticsBreakdown
                label={t('contests.statistics.tags')}
                items={(statistics.tags ?? []).map((item) => ({
                  label: item.name,
                  value: item.solved,
                }))}
              />
            </StatisticsSection>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatisticsSection title={t('contests.statistics.symbols')}>
              <StatisticsBreakdown
                label={t('contests.statistics.symbols')}
                items={(statistics.symbols ?? []).map((item) => ({
                  label: item.symbol,
                  value: item.solved,
                }))}
              />
            </StatisticsSection>
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
              <ContestStatisticsProblemList
                problems={statistics.unsolvedProblems}
                emptyText={t(
                  !statistics.overview?.totalAttempts && !statistics.contestRanks?.best
                    ? 'contests.statistics.noContestHistory'
                    : 'contests.statistics.noUnsolvedProblems',
                )}
              />
            </StatisticsSection>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatisticsSection title={t('contests.statistics.topAttempts')}>
              <ContestStatisticsProblemList
                problems={statistics.topAttempts}
                emptyText={t('contests.statistics.noData')}
              />
            </StatisticsSection>
          </Grid>
        </Grid>
        {statistics.worthyOpponents.length > 0 && (
          <StatisticsSection title={t('contests.statistics.worthyOpponents')}>
            <ContestStatisticsOpponents opponents={statistics.worthyOpponents} />
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
