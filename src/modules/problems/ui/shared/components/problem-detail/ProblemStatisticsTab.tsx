import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useProblemStatistics } from 'modules/problems/application/queries.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ReactEchart from 'shared/components/base/ReactEchart';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import { getColor } from 'shared/lib/echart-utils';
import { ProblemDetail, Verdicts } from 'modules/problems/domain/entities/problem.entity';

echarts.use([GridComponent, TooltipComponent, PieChart, LineChart, CanvasRenderer]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

interface ProblemStatisticsTabProps {
  problemId: number;
  problem?: ProblemDetail | null;
}

const usePaletteMap = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      primary: getColor(theme.vars.palette.primary.main),
      secondary: getColor(theme.vars.palette.secondary.main),
      success: getColor(theme.vars.palette.success.main),
      info: getColor(theme.vars.palette.info.main),
      warning: getColor(theme.vars.palette.warning.main),
      danger: getColor(theme.vars.palette.error.main),
      error: getColor(theme.vars.palette.error.main),
      dark: getColor(theme.vars.palette.text.primary),
      muted: getColor(theme.vars.palette.text.secondary),
    }),
    [theme.vars.palette],
  );
};

const OverviewMetric = ({
  label,
  value,
  tone = 'default',
  subtitle,
}: {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'danger';
  subtitle?: string;
}) => (
  <Box
    sx={{
      flex: 1,
      minWidth: { xs: '100%', md: 160 },
      borderRadius: 3,
      px: 2,
      py: 1.75,
      bgcolor:
        tone === 'success'
          ? 'rgba(46, 125, 50, 0.12)'
          : tone === 'danger'
            ? 'rgba(211, 47, 47, 0.12)'
            : 'rgba(255,255,255,0.14)',
      border: '1px solid rgba(255,255,255,0.18)',
      backdropFilter: 'blur(16px)',
    }}
  >
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography
      variant="h4"
      fontWeight={800}
      sx={{ color: 'common.white', lineHeight: 1.1, mt: 0.5 }}
    >
      {value}
    </Typography>
    {subtitle ? (
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
        {subtitle}
      </Typography>
    ) : null}
  </Box>
);

const InsightPill = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      px: 1.5,
      py: 1.1,
      borderRadius: 999,
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      minWidth: 0,
      boxShadow: '0 16px 30px rgba(15, 23, 42, 0.05)',
    }}
  >
    <IconifyIcon icon={icon} width={18} />
    <Typography variant="body2" color="text.secondary" noWrap>
      {label}
    </Typography>
    <Typography variant="subtitle2" fontWeight={700} noWrap>
      {value}
    </Typography>
  </Stack>
);

const QuickStatRow = ({ label, value }: { label: string; value: string }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{
      py: 1.1,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-of-type': { borderBottom: 'none', pb: 0 },
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" fontWeight={800} textAlign="right">
      {value}
    </Typography>
  </Stack>
);

const InsightMetricCard = ({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)',
      },
    }}
  >
    <CardContent>
      <Stack spacing={1.25}>
        <Chip icon={<IconifyIcon icon={icon} />} label={title} size="small" variant="soft" />
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

export const ProblemStatisticsTab = ({ problemId, problem }: ProblemStatisticsTabProps) => {
  const { t } = useTranslation();
  const paletteMap = usePaletteMap();
  const { data: stats, isLoading } = useProblemStatistics(problemId);

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

  const attemptChart: EChartsCoreOption | null = useMemo(() => {
    if (!stats?.attemptStatistics?.length) {
      return null;
    }

    const data = stats.attemptStatistics.map((item) => ({
      name: item.verdictTitle || String(item.verdict),
      value: item.value,
      itemStyle: {
        color:
          paletteMap[(item.color as keyof typeof paletteMap) ?? 'primary'] ?? paletteMap.primary,
      },
    }));

    return {
      tooltip: { trigger: 'item' },
      title: [
        {
          text: `${successRate}%`,
          left: 'center',
          top: '39%',
          textStyle: { fontSize: 30, fontWeight: 800, color: paletteMap.dark },
        },
        {
          text: t('problems.detail.successRate'),
          left: 'center',
          top: '54%',
          textStyle: { fontSize: 12, color: paletteMap.muted },
        },
      ],
      series: [
        {
          type: 'pie',
          radius: ['56%', '78%'],
          center: ['50%', '48%'],
          data,
          label: { show: false },
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        },
      ],
    };
  }, [paletteMap, stats?.attemptStatistics, successRate, t]);

  const attemptsForSolveChart: EChartsCoreOption | null = useMemo(() => {
    if (!stats?.attemptsForSolveStatistics?.length) {
      return null;
    }

    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 28, right: 18, top: 20, bottom: 24 },
      xAxis: {
        type: 'category',
        data: stats.attemptsForSolveStatistics.map((item) => item.attempts),
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        max: 100,
        axisLabel: { formatter: integerAxisLabelFormatter },
      },
      series: [
        {
          type: 'line',
          data: stats.attemptsForSolveStatistics.map((item) => item.value),
          smooth: true,
          areaStyle: {
            opacity: 0.18,
            color: paletteMap.primary,
          },
          lineStyle: { width: 3, color: paletteMap.primary },
          itemStyle: { color: paletteMap.primary },
          name: t('problems.detail.solved'),
        },
      ],
    };
  }, [paletteMap.primary, stats?.attemptsForSolveStatistics, t]);

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">{t('problems.detail.statisticsTitle')}</Typography>
            <LinearProgress />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Typography color="text.secondary">{t('problems.detail.noStatistics')}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ mt: 2 }}>
      <Card
        sx={{
          overflow: 'hidden',
          position: 'relative',
          color: 'common.white',
          background: `radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 30%), linear-gradient(135deg, ${paletteMap.primary} 0%, ${paletteMap.secondary} 100%)`,
          boxShadow: '0 28px 56px rgba(15, 23, 42, 0.18)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', xl: 'row' }}
              spacing={2.5}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', xl: 'center' }}
            >
              <Stack spacing={1} maxWidth={720}>
                <Typography variant="h4" fontWeight={800}>
                  {t('problems.detail.statisticsTitle')}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.84)' }}>
                  {t('problems.detail.statisticsSubtitle')}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {problem?.difficultyTitle ? (
                  <Chip
                    label={problem.difficultyTitle}
                    sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white' }}
                  />
                ) : null}
                {problem?.problemRating !== undefined ? (
                  <Chip
                    label={`Rating ${problem.problemRating}`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white' }}
                  />
                ) : null}
                <Chip
                  label={`${t('problems.detail.totalAttempts')}: ${totalAttempts}`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white' }}
                />
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
              <OverviewMetric
                label={t('problems.detail.usersSolved')}
                value={String(solvedUsers)}
                tone="success"
              />
              <OverviewMetric
                label={t('problems.detail.usersUnsolved')}
                value={String(unsolvedUsers)}
                tone="danger"
              />
              <OverviewMetric
                label={t('problems.detail.successRate')}
                value={`${successRate}%`}
                subtitle={`${totalUsers} ${t('problems.detail.dataCockpitAudience')}`}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <InsightPill
          label={t('problems.detail.dominantVerdict')}
          value={dominantVerdict?.verdictTitle ?? '--'}
          icon="mdi:gavel"
        />
        <InsightPill
          label={t('problems.detail.dominantLanguage')}
          value={dominantLanguage?.langFull ?? '--'}
          icon="mdi:code-braces"
        />
        <InsightPill
          label={t('problems.detail.firstAttemptSolveRate')}
          value={`${firstAttemptSolveRate}%`}
          icon="mdi:target-variant"
        />
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    {t('problems.detail.attemptStatistics')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.dataCockpitVerdictSubtitle')}
                  </Typography>
                </Box>

                {attemptChart ? (
                  <ReactEchart echarts={echarts} option={attemptChart} style={{ height: 320 }} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.noStatistics')}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(stats.attemptStatistics ?? []).map((item) => (
                    <Chip
                      key={`${item.verdict}-${item.value}`}
                      label={`${item.verdictTitle}: ${item.value}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    {t('problems.detail.languageStatistics')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.dataCockpitLanguageSubtitle')}
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  {(stats.languageStatistics ?? []).map((item) => {
                    const share = languageTotal
                      ? Math.round((100 * item.value) / languageTotal)
                      : 0;

                    return (
                      <Stack key={item.lang} spacing={0.75}>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
                            <AttemptLanguage lang={item.lang} langFull={item.langFull} size={28} />
                            <Typography variant="subtitle2" fontWeight={700} noWrap>
                              {item.langFull}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <Chip label={`${share}%`} size="small" variant="soft" color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              {item.value}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 999,
                            bgcolor: 'background.level1',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${share}%`,
                              height: '100%',
                              borderRadius: 999,
                              background: `linear-gradient(90deg, ${paletteMap.info}, ${paletteMap.primary})`,
                            }}
                          />
                        </Box>
                      </Stack>
                    );
                  })}

                  {!stats.languageStatistics?.length ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('problems.detail.noStatistics')}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 7 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    {t('problems.detail.numberAttemptsSolve')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.dataCockpitAttemptsSubtitle')}
                  </Typography>
                </Box>

                {attemptsForSolveChart ? (
                  <ReactEchart
                    echarts={echarts}
                    option={attemptsForSolveChart}
                    style={{ height: 280 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.noStatistics')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    {t('problems.detail.quickInsights')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.quickInsightsSubtitle')}
                  </Typography>
                </Box>

                <Stack>
                  <QuickStatRow
                    label={t('problems.detail.acceptanceShare')}
                    value={`${acceptanceShare}%`}
                  />
                  <QuickStatRow
                    label={t('problems.detail.verdictPressure')}
                    value={
                      dominantVerdict
                        ? `${dominantVerdict.verdictTitle} · ${dominantVerdictShare}%`
                        : '--'
                    }
                  />
                  <QuickStatRow
                    label={t('problems.detail.languageLeaderShare')}
                    value={
                      dominantLanguage
                        ? `${dominantLanguage.langFull} · ${dominantLanguageShare}%`
                        : '--'
                    }
                  />
                  <QuickStatRow
                    label={t('problems.detail.submissionPressure')}
                    value={submissionPressure}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InsightMetricCard
            title={t('problems.detail.acceptanceShare')}
            value={`${acceptanceShare}%`}
            subtitle={t('problems.detail.acceptanceShareSubtitle', {
              accepted: acceptedAttempts,
              total: totalAttempts,
            })}
            icon="mdi:check-decagram"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InsightMetricCard
            title={t('problems.detail.halfSolvePoint')}
            value={halfSolvePoint !== undefined ? `${halfSolvePoint}` : '--'}
            subtitle={t('problems.detail.halfSolvePointSubtitle')}
            icon="mdi:chart-timeline-variant"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InsightMetricCard
            title={t('problems.detail.ninetySolvePoint')}
            value={ninetySolvePoint !== undefined ? `${ninetySolvePoint}` : '--'}
            subtitle={t('problems.detail.ninetySolvePointSubtitle')}
            icon="mdi:bullseye-arrow"
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
