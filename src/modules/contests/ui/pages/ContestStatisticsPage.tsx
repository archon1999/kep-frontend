import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Avatar, Card, CardContent, Chip, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from 'shared/components/base/ReactEchart';
import KepIcon from 'shared/components/base/KepIcon';
import { getColor } from 'shared/lib/echart-utils';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestStatistics } from '../../application/queries';
import { ContestStatisticsBadgeEntry, ContestStatisticsBadges } from '../../domain/entities/contest-statistics.entity';
import ContestantView from '../components/ContestantView';
import ContestPageHeader from '../components/ContestPageHeader';

echarts.use([GridComponent, TooltipComponent, LegendComponent, LineChart, BarChart, PieChart, CanvasRenderer]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

type BadgeKey = keyof ContestStatisticsBadges;

const badgeOrder: BadgeKey[] = ['sniper', 'grinder', 'optimizer', 'neverGiveUp'];

const ContestStatisticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const { data: statistics, isLoading } = useContestStatistics(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestStatistics' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );
  const totalAttempts = statistics?.general?.attempts?.total;
  const totalAccepted = statistics?.general?.accepted?.total;
  const acceptanceRate = statistics?.general?.acceptanceRate;

  const resolvedLocale = useMemo(() => {
    const normalized = (i18n.language || '').replace('_', '-');
    try {
      const [canonical] = Intl.getCanonicalLocales(normalized || []);
      return canonical || undefined;
    } catch {
      return undefined;
    }
  }, [i18n.language]);

  const integerFormatter = useMemo(
    () =>
      new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 0,
      }),
    [resolvedLocale],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 2,
      }),
    [resolvedLocale],
  );

  const formatCount = useCallback(
    (value?: number | null) =>
      value !== undefined && value !== null ? integerFormatter.format(value) : undefined,
    [integerFormatter],
  );

  const formatPercent = useCallback(
    (value?: number | null) =>
      value !== undefined && value !== null ? `${percentFormatter.format(value)}%` : undefined,
    [percentFormatter],
  );

  const axisLabelColor = getColor(theme.vars.palette.text.secondary);
  const dividerColor = getColor(theme.vars.palette.divider);
  const neutralColor = getColor(theme.vars.palette.text.disabled);
  const primaryColor = getColor(theme.vars.palette.primary.main);
  const successColor = getColor(theme.vars.palette.success.main);
  const warningColor = getColor(theme.vars.palette.warning.main);
  const errorColor = getColor(theme.vars.palette.error.main);
  const surfaceColor = getColor(theme.vars.palette.background.paper);

  const overviewCards = useMemo(
    () => [
      {
        key: 'participants',
        icon: 'users',
        label: t('contests.statisticsPage.participants'),
        value: formatCount(statistics?.general?.participants),
      },
      {
        key: 'attempts',
        icon: 'attempts',
        label: t('contests.statisticsPage.totalAttempts'),
        value: formatCount(totalAttempts),
      },
      {
        key: 'accepted',
        icon: 'verdict',
        label: t('contests.statisticsPage.totalAccepted'),
        value: formatCount(totalAccepted),
      },
      {
        key: 'acceptance',
        icon: 'statistics',
        label: t('contests.statisticsPage.acceptance'),
        value: formatPercent(acceptanceRate),
      },
    ],
    [acceptanceRate, formatCount, formatPercent, statistics?.general?.participants, t, totalAccepted, totalAttempts],
  );

  const timelineOption: EChartsCoreOption | null = useMemo(() => {
    if (!statistics?.timeline?.length) return null;
    return {
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
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 3 },
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
  }, [axisLabelColor, dividerColor, primaryColor, statistics?.timeline]);

  const problemsOption: EChartsCoreOption | null = useMemo(() => {
    if (!statistics) return null;
    const problems = Object.keys(statistics.general.attempts.byProblem || {}).sort();
    if (!problems.length) return null;

    return {
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
          barWidth: 18,
          barGap: '25%',
          itemStyle: { borderRadius: 6 },
          data: problems.map((symbol) => statistics.general.attempts.byProblem[symbol] ?? 0),
        },
        {
          name: t('contests.statisticsPage.accepted'),
          type: 'bar',
          barWidth: 18,
          barGap: '25%',
          itemStyle: { borderRadius: 6 },
          data: problems.map((symbol) => statistics.general.accepted.byProblem[symbol] ?? 0),
        },
      ],
    };
  }, [axisLabelColor, dividerColor, primaryColor, statistics, successColor, t]);

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
      color: [successColor, errorColor, warningColor, neutralColor],
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, left: 'center', textStyle: { color: axisLabelColor } },
      series: [
        {
          type: 'pie',
          radius: ['52%', '72%'],
          center: ['50%', '45%'],
          itemStyle: {
            borderRadius: 8,
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
  }, [axisLabelColor, errorColor, formatCount, neutralColor, statistics, successColor, surfaceColor, t, warningColor]);

  const firstSolves = useMemo(() => {
    const entries = Object.entries(statistics?.firstSolves ?? {});
    return entries
      .map(([problem, entry]) => ({ problem, entry }))
      .sort((a, b) => a.problem.localeCompare(b.problem));
  }, [statistics?.firstSolves]);

  const badges = useMemo(
    () =>
      badgeOrder
        .map((key) => {
          const badge = statistics?.badges?.[key];
          if (!badge) return null;
          return { key, badge };
        })
        .filter(Boolean) as { key: BadgeKey; badge: ContestStatisticsBadgeEntry }[],
    [statistics?.badges],
  );

  const badgeLabels: Record<BadgeKey, string> = {
    sniper: t('contests.statisticsPage.badgeLabels.sniper'),
    grinder: t('contests.statisticsPage.badgeLabels.grinder'),
    optimizer: t('contests.statisticsPage.badgeLabels.optimizer'),
    neverGiveUp: t('contests.statisticsPage.badgeLabels.neverGiveUp'),
  };

  const badgeIcons: Record<BadgeKey, string> = {
    sniper: 'contest',
    grinder: 'attempts',
    optimizer: 'statistics',
    neverGiveUp: 'question',
  };

  const badgeColors: Record<BadgeKey, string> = {
    sniper: getColor(theme.vars.palette.info.main),
    grinder: getColor(theme.vars.palette.warning.main),
    optimizer: getColor(theme.vars.palette.success.main),
    neverGiveUp: getColor(theme.vars.palette.primary.main),
  };

  const renderBadgeDetails = (key: BadgeKey, badge: ContestStatisticsBadgeEntry) => {
    switch (key) {
      case 'sniper':
        return t('contests.statisticsPage.badgeDetails.sniper', {
          problem: badge.problem ?? '—',
          time: badge.time ?? '—',
        });
      case 'grinder':
        return t('contests.statisticsPage.badgeDetails.grinder', {
          attempts: formatCount(badge.attempts ?? 0) ?? '0',
        });
      case 'optimizer':
        return t('contests.statisticsPage.badgeDetails.optimizer', {
          solved: formatCount(badge.solvedProblems ?? 0) ?? '0',
          wrong: formatCount(badge.wrongAttempts ?? 0) ?? '0',
        });
      case 'neverGiveUp':
        return t('contests.statisticsPage.badgeDetails.neverGiveUp', {
          problem: badge.problem ?? '—',
          attempts: formatCount(badge.attempts ?? 0) ?? '0',
        });
      default:
        return '';
    }
  };

  const renderChart = (option: EChartsCoreOption | null, height: number) => {
    if (isLoading) {
      return <Skeleton variant="rounded" height={height} />;
    }

    if (!option) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('contests.statisticsPage.noData')}
        </Typography>
      );
    }

    return <ReactEchart echarts={echarts} option={option} style={{ height }} />;
  };

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.statisticsPage.title')}
        contest={contest as any}
        contestId={contestId}
        isRated={contest?.isRated}
        showLogoOverlay
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        {overviewCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.key}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                height: '100%',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                  <Stack direction="column" spacing={0.75}>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <KepIcon name={card.icon as any} fontSize={18} />
                      <Typography variant="body1" fontWeight={500}>
                        {card.label}
                      </Typography>
                    </Stack>
                    {card.value ? (
                      <Typography variant="h5" fontWeight={800}>
                        {card.value}
                      </Typography>
                    ) : (
                      <Skeleton width={80} height={32} />
                    )}
                  </Stack>
                  <Avatar
                    sx={(avatarTheme) => ({
                      width: 44,
                      height: 44,
                      bgcolor: `${getColor(avatarTheme.vars.palette.primary.main)}12`,
                      color: avatarTheme.vars.palette.primary.main,
                    })}
                  >
                    <KepIcon name={card.icon as any} fontSize={20} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack direction="column" spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('contests.statisticsPage.timeline')}
                  </Typography>
                  {totalAttempts !== undefined ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('contests.statisticsPage.attempts')} · {formatCount(totalAttempts)}
                    </Typography>
                  ) : null}
                </Stack>
                {renderChart(timelineOption, 280)}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack direction="column" spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('contests.statisticsPage.verdicts')}
                </Typography>
                {renderChart(verdictOption, 280)}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack direction="column" spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('contests.statisticsPage.problemAttempts')}
                  </Typography>
                  {totalAccepted !== undefined ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('contests.statisticsPage.accepted')} · {formatCount(totalAccepted)}
                    </Typography>
                  ) : null}
                </Stack>
                {renderChart(problemsOption, 320)}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('contests.statisticsPage.badges')}
                </Typography>
                {isLoading ? (
                  <Skeleton variant="rounded" height={160} />
                ) : badges.length ? (
                  <Stack spacing={1.25} divider={<Divider flexItem />}>
                    {badges.map(({ key, badge }) => (
                      <Stack key={key} direction="row" spacing={1.25} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: `${badgeColors[key]}1A`,
                            color: badgeColors[key],
                          }}
                        >
                          <KepIcon name={badgeIcons[key] as any} fontSize={18} />
                        </Avatar>
                        <Stack direction="column" spacing={0.25} flex={1} minWidth={0}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {badgeLabels[key]}
                          </Typography>
                          {badge.contestant ? (
                            <ContestantView contestant={badge.contestant} imgSize={28} sx={{ minWidth: 0 }} />
                          ) : null}
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
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('contests.statisticsPage.firstSolves')}
                </Typography>
                {isLoading ? (
                  <Skeleton variant="rounded" height={200} />
                ) : firstSolves.length ? (
                  <Stack spacing={1} divider={<Divider flexItem />}>
                    {firstSolves.map(({ problem, entry }) => (
                      <Stack key={problem} direction="row" spacing={1} alignItems="center">
                        <Chip label={problem} size="small" color="primary" variant="outlined" />
                        <ContestantView contestant={entry.contestant} imgSize={28} sx={{ flex: 1, minWidth: 0 }} />
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
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {t('contests.statisticsPage.facts')}
              </Typography>
              {isLoading ? (
                <Skeleton variant="rounded" height={160} />
              ) : statistics?.facts?.length ? (
                <Stack spacing={1.25} divider={<Divider flexItem />}>
                  {statistics.facts.map((fact, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                      <KepIcon name="check" fontSize={18} sx={{ mt: 0.25, color: 'success.main' }} />
                      <Typography variant="body2">{fact}</Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('contests.statisticsPage.noData')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestStatisticsPage;
