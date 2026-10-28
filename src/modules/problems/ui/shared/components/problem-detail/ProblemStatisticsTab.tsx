import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useProblemStatistics } from 'modules/problems/application/queries';
import { ProblemDetail, Verdicts } from 'modules/problems/domain/entities/problem.entity';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import StatisticsBreakdown from 'shared/components/statistics/StatisticsBreakdown';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import StatisticsMetric from 'shared/components/statistics/StatisticsMetric';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import {
  StatisticsMetricSkeleton,
  StatisticsSectionSkeleton,
} from 'shared/components/statistics/StatisticsSkeleton';
import useChartPalette from 'shared/hooks/useChartPalette';
import { getColor } from 'shared/lib/echart-utils';

echarts.use([GridComponent, TitleComponent, TooltipComponent, PieChart, LineChart, CanvasRenderer]);

interface ProblemStatisticsTabProps {
  problemId: number;
  problem?: ProblemDetail | null;
}

const usePaletteMap = () => {
  const palette = useChartPalette();

  return useMemo(
    () => ({
      primary: getColor(palette.primary.main),
      secondary: getColor(palette.secondary.main),
      success: getColor(palette.success.main),
      info: getColor(palette.info.main),
      warning: getColor(palette.warning.main),
      danger: getColor(palette.error.main),
      error: getColor(palette.error.main),
      dark: getColor(palette.text.primary),
      muted: getColor(palette.text.secondary),
    }),
    [palette],
  );
};

export const ProblemStatisticsTab = ({ problemId, problem }: ProblemStatisticsTabProps) => {
  const { t } = useTranslation();
  const paletteMap = usePaletteMap();
  const { data: stats, isLoading, error, mutate } = useProblemStatistics(problemId);

  const solvedUsers = problem?.solved ?? 0;
  const unsolvedUsers = problem?.notSolved ?? 0;
  const totalUsers = solvedUsers + unsolvedUsers;
  const successRate = totalUsers ? Math.round((100 * solvedUsers) / totalUsers) : 0;

  const totalAttempts = useMemo(
    () => (stats?.attemptStatistics ?? []).reduce((sum, item) => sum + item.value, 0),
    [stats?.attemptStatistics],
  );

  const acceptedAttempts = useMemo(
    () =>
      (stats?.attemptStatistics ?? []).find((item) => item.verdict === Verdicts.Accepted)?.value ??
      0,
    [stats?.attemptStatistics],
  );

  const acceptanceShare = totalAttempts ? Math.round((100 * acceptedAttempts) / totalAttempts) : 0;

  const dominantVerdict = useMemo(
    () => [...(stats?.attemptStatistics ?? [])].sort((a, b) => b.value - a.value)[0],
    [stats?.attemptStatistics],
  );

  const dominantVerdictShare = totalAttempts
    ? Math.round((100 * (dominantVerdict?.value ?? 0)) / totalAttempts)
    : 0;

  const dominantLanguage = useMemo(
    () => [...(stats?.languageStatistics ?? [])].sort((a, b) => b.value - a.value)[0],
    [stats?.languageStatistics],
  );

  const languageTotal = useMemo(
    () => (stats?.languageStatistics ?? []).reduce((sum, item) => sum + item.value, 0),
    [stats?.languageStatistics],
  );

  const dominantLanguageShare = languageTotal
    ? Math.round((100 * (dominantLanguage?.value ?? 0)) / languageTotal)
    : 0;

  const firstAttemptSolveRate = useMemo(() => {
    const firstAttemptBucket = (stats?.attemptsForSolveStatistics ?? []).find(
      (item) => item.attempts === 1,
    );
    return firstAttemptBucket?.value ?? 0;
  }, [stats?.attemptsForSolveStatistics]);

  const halfSolvePoint = useMemo(
    () => (stats?.attemptsForSolveStatistics ?? []).find((item) => item.value >= 50)?.attempts,
    [stats?.attemptsForSolveStatistics],
  );

  const ninetySolvePoint = useMemo(
    () => (stats?.attemptsForSolveStatistics ?? []).find((item) => item.value >= 90)?.attempts,
    [stats?.attemptsForSolveStatistics],
  );

  const submissionPressure = totalUsers ? (totalAttempts / totalUsers).toFixed(1) : '0.0';

  const attemptsForSolveChart: EChartsCoreOption | null = useMemo(() => {
    if (!stats?.attemptsForSolveStatistics?.length) {
      return null;
    }

    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 44, right: 18, top: 20, bottom: 24 },
      xAxis: {
        type: 'category',
        data: stats.attemptsForSolveStatistics.map((item) => item.attempts),
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        max: 100,
        axisLabel: { formatter: '{value}%' },
      },
      series: [
        {
          type: 'line',
          data: stats.attemptsForSolveStatistics.map((item) => item.value),
          smooth: false,
          areaStyle: {
            opacity: 0.08,
            color: paletteMap.primary,
          },
          lineStyle: { width: 2, color: paletteMap.primary },
          itemStyle: { color: paletteMap.primary },
          name: t('problems.detail.solved'),
        },
      ],
    };
  }, [paletteMap.primary, stats?.attemptsForSolveStatistics, t]);

  if (isLoading)
    return (
      <Grid container spacing={0} aria-busy="true" aria-label={t('common.loading')}>
        {['usersSolved', 'usersUnsolved', 'successRate', 'totalAttempts'].map((key) => (
          <Grid key={key} size={{ xs: 6, md: 3 }}>
            <StatisticsMetricSkeleton label={t('problems.detail.' + key)} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, lg: 6 }}>
          <StatisticsSection title={t('problems.detail.attemptStatistics')}>
            <StatisticsBreakdown
              loading
              label={t('problems.detail.attemptStatistics')}
              items={[]}
            />
          </StatisticsSection>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <StatisticsSectionSkeleton title={t('problems.detail.languageStatistics')} rows={4} />
        </Grid>
        <Grid size={12}>
          <StatisticsSectionSkeleton title={t('problems.detail.numberAttemptsSolve')} />
        </Grid>
      </Grid>
    );
  if (error)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void mutate()}>{t('common.statistics.retry')}</Button>}
      >
        {t('common.statistics.error')}
      </Alert>
    );
  if (!stats)
    return (
      <StatisticsSection>
        <Typography color="text.secondary">{t('problems.detail.noStatistics')}</Typography>
      </StatisticsSection>
    );

  return (
    <Grid container spacing={0}>
      {[
        {
          label: t('problems.detail.usersSolved'),
          value: String(solvedUsers),
          valueColor: 'success.main',
        },
        { label: t('problems.detail.usersUnsolved'), value: String(unsolvedUsers) },
        { label: t('problems.detail.successRate'), value: `${successRate}%` },
        { label: t('problems.detail.totalAttempts'), value: String(totalAttempts) },
      ].map((metric) => (
        <Grid key={metric.label} size={{ xs: 6, md: 3 }}>
          <StatisticsMetric {...metric} />
        </Grid>
      ))}
      <Grid size={{ xs: 12, lg: 6 }}>
        <StatisticsSection title={t('problems.detail.attemptStatistics')}>
          <StatisticsBreakdown
            label={t('problems.detail.attemptStatistics')}
            totalLabel={t('problems.detail.totalAttempts')}
            items={stats.attemptStatistics.map((item) => ({
              label: item.verdictTitle || String(item.verdict),
              value: item.value,
              color:
                paletteMap[(item.color as keyof typeof paletteMap) ?? 'primary'] ??
                paletteMap.primary,
            }))}
          />
        </StatisticsSection>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <StatisticsSection title={t('problems.detail.languageStatistics')}>
          <Stack spacing={2.5}>
            {stats.languageStatistics.map((item) => {
              const share = languageTotal ? Math.round((100 * item.value) / languageTotal) : 0;
              return (
                <Box key={item.lang}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <Stack direction="row" gap={1} alignItems="center" minWidth={0}>
                      <AttemptLanguage lang={item.lang} langFull={item.langFull} size={24} />
                      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                        {item.langFull}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {item.value} · {share}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={share}
                    aria-label={item.langFull}
                    sx={{ height: 4, borderRadius: 0, bgcolor: 'action.hover' }}
                  />
                </Box>
              );
            })}
          </Stack>
          {!stats.languageStatistics.length && (
            <Typography variant="body2" color="text.secondary">
              {t('problems.detail.noStatistics')}
            </Typography>
          )}
        </StatisticsSection>
      </Grid>
      <Grid size={12}>
        <StatisticsSection
          title={t('problems.detail.numberAttemptsSolve')}
          subtitle={t('problems.detail.dataCockpitAttemptsSubtitle')}
        >
          <StatisticsChart
            label={t('problems.detail.numberAttemptsSolve')}
            option={attemptsForSolveChart}
          />
        </StatisticsSection>
      </Grid>
      {[
        { label: t('problems.detail.firstAttemptSolveRate'), value: `${firstAttemptSolveRate}%` },
        {
          label: t('problems.detail.halfSolvePoint'),
          value: halfSolvePoint ?? '—',
          subtitle: t('problems.detail.halfSolvePointSubtitle'),
        },
        {
          label: t('problems.detail.ninetySolvePoint'),
          value: ninetySolvePoint ?? '—',
          subtitle: t('problems.detail.ninetySolvePointSubtitle'),
        },
      ].map((metric) => (
        <Grid key={metric.label} size={{ xs: 12, md: 4 }}>
          <StatisticsMetric {...metric} />
        </Grid>
      ))}
      <Grid size={12}>
        <StatisticsSection title={t('problems.detail.quickInsights')}>
          <Stack spacing={2}>
            {[
              {
                label: t('problems.detail.acceptanceShare'),
                value: `${acceptanceShare}%`,
                detail: t('problems.detail.acceptanceShareSubtitle', {
                  accepted: acceptedAttempts,
                  total: totalAttempts,
                }),
              },
              {
                label: t('problems.detail.verdictPressure'),
                value: dominantVerdict
                  ? `${dominantVerdict.verdictTitle} · ${dominantVerdictShare}%`
                  : '—',
              },
              {
                label: t('problems.detail.languageLeaderShare'),
                value: dominantLanguage
                  ? `${dominantLanguage.langFull} · ${dominantLanguageShare}%`
                  : '—',
              },
              { label: t('problems.detail.submissionPressure'), value: submissionPressure },
            ].map((row) => (
              <Stack
                key={row.label}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                gap={1}
                sx={{ pb: 1.5, borderBottom: 1, borderColor: 'divider' }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {row.label}
                  </Typography>
                  {row.detail && (
                    <Typography variant="caption" color="text.secondary">
                      {row.detail}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </StatisticsSection>
      </Grid>
    </Grid>
  );
};
