import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import {
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
  DEFAULT_ACTIVITY_DAYS,
  useProblemsUserStatisticsPage,
} from 'modules/problems/application/hooks/useProblemsUserStatisticsPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import useChartPalette from 'shared/hooks/useChartPalette';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import ProblemsUserStatisticsPageFactsCard from './ProblemsUserStatisticsPageFactsCard';
import ProblemsUserStatisticsPageOverviewCard from './ProblemsUserStatisticsPageOverviewCard';
import {
  ProblemsDifficultyPanel,
  ProblemsLanguagesPanel,
  ProblemsTagsPanel,
} from './components/ProblemsStatisticsPanels';
import {
  buildActivityOption,
  buildAttemptsOption,
  buildBarOption,
  buildHeatmapOption,
} from './components/chartOptions';

echarts.use([
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  LegacyGridContainLabel,
  HeatmapChart,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

const ProblemsUserStatisticsPage = () => {
  const {
    state,
    setField,
    statistics,
    isLoading,
    error,
    mutate,
    activityLoading,
    activityError,
    retryActivity,
    heatmapLoading,
    heatmapError,
    retryHeatmap,
    selectedHeatmapFilter,
    activityStatistics,
    heatmapStatistics,
    availableDays,
    heatmapFilterOptions,
  } = useProblemsUserStatisticsPage();

  const { t, i18n } = useTranslation();
  const palette = useChartPalette();

  const activityOption = useMemo(
    () => buildActivityOption(activityStatistics?.lastDays?.series ?? [], t),
    [activityStatistics?.lastDays?.series, t],
  );
  const heatmapOption = useMemo(
    () => buildHeatmapOption(heatmapStatistics, palette, t),
    [heatmapStatistics, palette, t],
  );
  const weekdayOption = useMemo(
    () => buildBarOption(statistics?.byWeekday ?? [], t),
    [statistics?.byWeekday, t],
  );
  const monthOption = useMemo(
    () => buildBarOption(statistics?.byMonth ?? [], t),
    [statistics?.byMonth, t],
  );
  const periodOption = useMemo(
    () => buildBarOption(statistics?.byPeriod ?? [], t),
    [statistics?.byPeriod, t],
  );
  const attemptsChartOption = useMemo(
    () => buildAttemptsOption(statistics?.numberOfAttempts?.chartSeries ?? []),
    [statistics?.numberOfAttempts?.chartSeries],
  );
  const numberFormatter = useMemo(
    () =>
      createNumberFormatter(
        {
          maximumFractionDigits: 2,
        },
        i18n.language,
      ),
    [i18n.language],
  );

  return (
    <FramedPage>
      <PageHeader title={t('problems.statisticsPage.title')} backTo={resources.Problems} />
      {isLoading && (
        <StatisticsSection>
          <LinearProgress aria-label={t('common.loading')} />
        </StatisticsSection>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ m: 'var(--kep-content-inset)' }}
          action={<Button onClick={() => void mutate()}>{t('common.statistics.retry')}</Button>}
        >
          {t('common.statistics.error')}
        </Alert>
      )}
      {!isLoading && !error && !statistics && (
        <StatisticsSection>{t('problems.statisticsPage.noData')}</StatisticsSection>
      )}
      {statistics && (
        <>
          <Grid container spacing={0}>
            {[
              {
                icon: 'solved',
                label: t('problems.statisticsPage.cards.solved'),
                value: numberFormatter.format(statistics.general?.solved ?? 0),
                subtitle: t('problems.statisticsPage.cards.problems'),
              },
              {
                icon: 'rating',
                label: t('problems.statisticsPage.cards.rating'),
                value: numberFormatter.format(statistics.general?.rating ?? 0),
              },
              {
                icon: 'users',
                label: t('problems.statisticsPage.cards.rank'),
                value: String(statistics.general?.rank ?? '—'),
                subtitle: t('problems.statisticsPage.cards.usersCount', {
                  count: statistics.general?.usersCount ?? 0,
                }),
              },
              {
                icon: 'attempt',
                label: t('problems.statisticsPage.cards.singleAttempt'),
                value: numberFormatter.format(statistics.facts?.solvedWithSingleAttempt ?? 0),
                subtitle:
                  statistics.facts?.solvedWithSingleAttemptPercentage !== undefined
                    ? `${statistics.facts.solvedWithSingleAttemptPercentage}%`
                    : undefined,
              },
            ].map((card) => (
              <Grid key={card.label} size={{ xs: 6, md: 3 }}>
                <ProblemsUserStatisticsPageOverviewCard {...card} />
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 8 }}>
              <StatisticsSection
                title={t('problems.statisticsPage.activity.title')}
                action={
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    aria-label={t('common.statistics.period')}
                    value={state.selectedDays ?? DEFAULT_ACTIVITY_DAYS}
                    onChange={(_, value) => value && setField('selectedDays', value)}
                  >
                    {availableDays.map((option) => (
                      <ToggleButton
                        value={option}
                        key={option}
                        aria-label={t('common.statistics.days', { count: option })}
                      >
                        {t('common.statistics.days', { count: option })}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                }
              >
                {activityError ? (
                  <Alert
                    severity="error"
                    action={
                      <Button onClick={() => void retryActivity()}>
                        {t('common.statistics.retry')}
                      </Button>
                    }
                  >
                    {t('common.statistics.error')}
                  </Alert>
                ) : (
                  <StatisticsChart
                    label={t('problems.statisticsPage.activity.title')}
                    option={activityOption}
                    loading={activityLoading}
                  />
                )}
              </StatisticsSection>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ProblemsLanguagesPanel statistics={statistics} />
            </Grid>
            <Grid size={12}>
              <StatisticsSection
                title={t('problems.statisticsPage.heatmap.title')}
                action={
                  <Select
                    size="small"
                    value={selectedHeatmapFilter}
                    onChange={(event) => setField('selectedHeatmap', event.target.value)}
                    inputProps={{ 'aria-label': t('problems.statisticsPage.heatmap.title') }}
                    sx={{ minWidth: 150, maxWidth: '100%' }}
                  >
                    {heatmapFilterOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                }
              >
                {heatmapError ? (
                  <Alert
                    severity="error"
                    action={
                      <Button onClick={() => void retryHeatmap()}>
                        {t('common.statistics.retry')}
                      </Button>
                    }
                  >
                    {t('common.statistics.error')}
                  </Alert>
                ) : (
                  <Box
                    role="region"
                    aria-label={t('problems.statisticsPage.heatmap.title')}
                    tabIndex={0}
                    sx={{ overflowX: 'auto' }}
                  >
                    <Box sx={{ minWidth: 680 }}>
                      <StatisticsChart
                        label={t('problems.statisticsPage.heatmap.title')}
                        option={heatmapOption}
                        loading={heatmapLoading}
                        height={220}
                      />
                    </Box>
                  </Box>
                )}
              </StatisticsSection>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProblemsDifficultyPanel statistics={statistics} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProblemsTagsPanel statistics={statistics} />
            </Grid>
            {[
              { key: 'byWeekday', option: weekdayOption },
              { key: 'byMonth', option: monthOption },
              { key: 'byTime', option: periodOption },
            ].map((chart) => (
              <Grid key={chart.key} size={{ xs: 12, md: 4 }}>
                <StatisticsSection title={t(`common.statistics.${chart.key}`)}>
                  <StatisticsChart
                    label={t(`common.statistics.${chart.key}`)}
                    option={chart.option}
                    height={300}
                  />
                </StatisticsSection>
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 6 }}>
              <StatisticsSection title={t('problems.statisticsPage.attempts.title')}>
                <StatisticsChart
                  label={t('problems.statisticsPage.attempts.title')}
                  option={attemptsChartOption}
                  height={300}
                />
              </StatisticsSection>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProblemsUserStatisticsPageFactsCard statistics={statistics} />
            </Grid>
          </Grid>
        </>
      )}
    </FramedPage>
  );
};

export default ProblemsUserStatisticsPage;
