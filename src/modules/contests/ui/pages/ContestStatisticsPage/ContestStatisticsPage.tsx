import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  BadgeKey,
  useContestStatisticsPage,
} from 'modules/contests/application/hooks/useContestStatisticsPage';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import KepIcon from 'shared/components/base/KepIcon';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import StatisticsMetric from 'shared/components/statistics/StatisticsMetric';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import type { KepIconName } from 'shared/config/icons';
import useChartPalette from 'shared/hooks/useChartPalette';
import { getColor } from 'shared/lib/echart-utils';

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer,
]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

const ContestStatisticsPage = () => {
  const {
    contest,
    isContestLoading,
    contestError,
    statistics,
    isLoading,
    sectionError,
    contestId,
    totalAttempts,
    totalAccepted,
    overviewCards,
    firstSolves,
    badges,
    formatCount,
    badgeLabels,
    badgeIcons,
    renderBadgeDetails,
  } = useContestStatisticsPage();

  const { t } = useTranslation();
  const palette = useChartPalette();
  const theme = useTheme();

  const axisLabelColor = getColor(palette.text.secondary);
  const dividerColor = getColor(palette.divider);
  const neutralColor = getColor(palette.text.disabled);
  const primaryColor = getColor(palette.primary.main);
  const successColor = getColor(palette.success.main);
  const warningColor = getColor(palette.warning.main);
  const errorColor = getColor(palette.error.main);
  const surfaceColor = getColor(palette.background.default);

  const timelineOption: EChartsCoreOption | null = useMemo(() => {
    if (!statistics?.timeline?.length) return null;
    return {
      textStyle: { fontFamily: theme.typography.fontFamily },
      color: [primaryColor],
      grid: { left: 48, right: 16, bottom: 48, top: 32 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: statistics.timeline.map((item) => item.range),
        boundaryGap: false,
        axisLabel: {
          color: axisLabelColor,
          rotate: -35,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          color: axisLabelColor,
          formatter: integerAxisLabelFormatter,
        },
        minInterval: 1,
        splitLine: {
          lineStyle: { color: dividerColor },
        },
      },
      series: [
        {
          type: 'line',
          data: statistics.timeline.map((item) => item.attempts),
          smooth: false,
          symbol: 'rect',
          symbolSize: 4,
          lineStyle: { width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${primaryColor}33` },
                { offset: 1, color: `${primaryColor}05` },
              ],
            },
          },
        },
      ],
    };
  }, [
    theme.typography.fontFamily,
    axisLabelColor,
    dividerColor,
    primaryColor,
    statistics?.timeline,
  ]);

  const problemsOption: EChartsCoreOption | null = useMemo(() => {
    if (!statistics) return null;
    const problems = Object.keys(statistics.general.attempts.byProblem || {}).sort();
    if (!problems.length) return null;

    return {
      textStyle: { fontFamily: theme.typography.fontFamily },
      color: [primaryColor, successColor],
      grid: { left: 48, right: 16, bottom: 48, top: 56 },
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: axisLabelColor } },
      xAxis: { type: 'category', data: problems, axisLabel: { color: axisLabelColor } },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: { color: axisLabelColor, formatter: integerAxisLabelFormatter },
        splitLine: { lineStyle: { color: dividerColor } },
        minInterval: 1,
      },
      series: [
        {
          name: t('contests.statisticsPage.attempts'),
          type: 'bar',
          barMaxWidth: 18,
          barGap: '25%',
          itemStyle: { borderRadius: 0 },
          data: problems.map((symbol) => statistics.general.attempts.byProblem[symbol] ?? 0),
        },
        {
          name: t('contests.statisticsPage.accepted'),
          type: 'bar',
          barMaxWidth: 18,
          barGap: '25%',
          itemStyle: { borderRadius: 0 },
          data: problems.map((symbol) => statistics.general.accepted.byProblem[symbol] ?? 0),
        },
      ],
    };
  }, [
    theme.typography.fontFamily,
    axisLabelColor,
    dividerColor,
    primaryColor,
    statistics,
    successColor,
    t,
  ]);

  const verdictOption: EChartsCoreOption | null = useMemo(() => {
    if (!statistics) return null;
    const data = [
      { value: statistics.verdicts.accepted, name: t('contests.verdicts.AC') },
      { value: statistics.verdicts.wrongAnswer, name: t('contests.verdicts.WA') },
      { value: statistics.verdicts.timeLimitExceeded, name: t('contests.verdicts.TLE') },
      { value: statistics.verdicts.other, name: t('contests.verdicts.OTHER') },
    ];
    const totalVerdicts = data.reduce((total, item) => total + (item.value ?? 0), 0);
    return {
      textStyle: { fontFamily: theme.typography.fontFamily },
      color: [successColor, errorColor, warningColor, neutralColor],
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, left: 'center', textStyle: { color: axisLabelColor } },
      series: [
        {
          type: 'pie',
          radius: ['52%', '72%'],
          center: ['50%', '45%'],
          itemStyle: {
            borderRadius: 0,
            borderColor: surfaceColor,
            borderWidth: 2,
          },
          label: { show: false },
          data,
        },
      ],
      graphic: totalVerdicts
        ? [
            {
              type: 'group',
              left: 'center',
              top: '45%',
              children: [
                {
                  type: 'text',
                  style: {
                    text: formatCount(totalVerdicts) ?? '0',
                    fill: axisLabelColor,
                    fontSize: 20,
                    fontWeight: 800,
                  },
                },
                {
                  type: 'text',
                  top: 20,
                  style: {
                    text: t('contests.statisticsPage.attempts'),
                    fill: axisLabelColor,
                    fontSize: 12,
                  },
                },
              ],
            },
          ]
        : undefined,
    };
  }, [
    theme.typography.fontFamily,
    axisLabelColor,
    errorColor,
    formatCount,
    neutralColor,
    statistics,
    successColor,
    surfaceColor,
    t,
    warningColor,
  ]);

  const badgeColors: Record<BadgeKey, string> = {
    sniper: getColor(palette.info.main),
    grinder: getColor(palette.warning.main),
    optimizer: getColor(palette.success.main),
    neverGiveUp: getColor(palette.primary.main),
  };

  return (
    <ContestPageLayout
      flush
      error={contestError || sectionError}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.statisticsPage.title')}
          contest={contest}
          contestId={contestId}
          isRated={contest?.isRated}
          isLoading={isContestLoading}
        />
      }
    >
      <Grid container spacing={0}>
        {overviewCards.map((card) => (
          <Grid key={card.key} size={{ xs: 6, md: 3 }}>
            <StatisticsMetric
              label={card.label}
              value={isLoading ? <Skeleton width={80} /> : card.value}
              icon={<KepIcon name={card.icon as KepIconName} fontSize={20} />}
            />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 8 }}>
          <StatisticsSection
            title={t('contests.statisticsPage.timeline')}
            action={
              totalAttempts !== undefined && (
                <Typography variant="body2" color="text.secondary">
                  {t('contests.statisticsPage.attempts')} · {formatCount(totalAttempts)}
                </Typography>
              )
            }
          >
            <StatisticsChart
              label={t('contests.statisticsPage.timeline')}
              option={timelineOption}
              loading={isLoading}
            />
          </StatisticsSection>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatisticsSection title={t('contests.statisticsPage.verdicts')}>
            <StatisticsChart
              label={t('contests.statisticsPage.verdicts')}
              option={verdictOption}
              loading={isLoading}
            />
          </StatisticsSection>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StatisticsSection
            title={t('contests.statisticsPage.problemAttempts')}
            action={
              totalAccepted !== undefined && (
                <Typography variant="body2" color="text.secondary">
                  {t('contests.statisticsPage.accepted')} · {formatCount(totalAccepted)}
                </Typography>
              )
            }
          >
            <StatisticsChart
              label={t('contests.statisticsPage.problemAttempts')}
              option={problemsOption}
              loading={isLoading}
              height={300}
            />
          </StatisticsSection>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatisticsSection title={t('contests.statisticsPage.badges')}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : badges.length ? (
              <Stack spacing={2} divider={<Divider />}>
                {badges.map(({ key, badge }) => (
                  <Stack key={key} direction="row" spacing={1.5} alignItems="flex-start">
                    <KepIcon
                      name={badgeIcons[key] as KepIconName}
                      fontSize={22}
                      sx={{ color: badgeColors[key], mt: 0.5 }}
                    />
                    <Stack spacing={0.75} minWidth={0}>
                      <Typography variant="label">{badgeLabels[key]}</Typography>
                      {badge.contestant && (
                        <ContestantView
                          contestant={badge.contestant}
                          imgSize={24}
                          sx={{ minWidth: 0 }}
                        />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {renderBadgeDetails(key, badge)}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('contests.statisticsPage.noBadges')}
              </Typography>
            )}
          </StatisticsSection>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StatisticsSection title={t('contests.statisticsPage.firstSolves')}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : firstSolves.length ? (
              <Stack spacing={1.5} divider={<Divider />}>
                {firstSolves.map(({ problem, entry }) => (
                  <Stack key={problem} direction="row" gap={1.5} alignItems="center">
                    <Typography
                      variant="metric"
                      color="primary.main"
                      sx={{ width: 36, flexShrink: 0, fontSize: 22 }}
                    >
                      {problem}
                    </Typography>
                    <ContestantView
                      contestant={entry.contestant}
                      imgSize={24}
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {entry.time ?? '—'}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('contests.statisticsPage.noFirstSolves')}
              </Typography>
            )}
          </StatisticsSection>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatisticsSection title={t('contests.statisticsPage.facts')}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={160} />
            ) : statistics?.facts?.length ? (
              <Stack spacing={2} divider={<Divider />}>
                {statistics.facts.map((fact, index) => (
                  <Stack key={index} direction="row" gap={1} alignItems="flex-start">
                    <KepIcon name="check" fontSize={18} sx={{ mt: 0.25, color: 'primary.main' }} />
                    <Typography variant="body2">{fact}</Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('contests.statisticsPage.noData')}
              </Typography>
            )}
          </StatisticsSection>
        </Grid>
      </Grid>
    </ContestPageLayout>
  );
};

export default ContestStatisticsPage;
