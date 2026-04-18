import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import KepIcon from 'shared/components/base/KepIcon';
import ReactEchart from 'shared/components/base/ReactEchart';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { getColor } from 'shared/lib/echart-utils';
import { numberParam, stringParam } from 'shared/lib/queryParams';
import {
  useProblemsUserStatistics,
  useProblemsUserStatisticsActivity,
  useProblemsUserStatisticsHeatmap,
} from '../../application/queries';
import { difficultyColorByKey, difficultyOptions } from '../../config/difficulty';
import {
  ProblemsStatisticsAttemptsChartEntry,
  ProblemsUserStatistics,
  ProblemsUserStatisticsActivity,
  ProblemsUserStatisticsHeatmap,
} from '../../domain/entities/problem.entity';

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  HeatmapChart,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

const DEFAULT_ACTIVITY_DAYS = 7;
const DEFAULT_HEATMAP_FILTER = 'recent';
const HEATMAP_START_YEAR = 2021;
const ACTIVITY_DAY_OPTIONS = [3, 7, 14, 30] as const;
const chartContentSx = { p: 0, '&:last-child': { pb: 0 } };

const OverviewCard = ({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
}) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <KepIcon name={icon as any} fontSize={28} />
        <Stack direction="column" spacing={0.5} flex={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const FactsCard = ({ statistics }: { statistics: ProblemsUserStatistics | undefined }) => {
  const { t } = useTranslation();

  const items = [
    {
      key: 'firstAttempt',
      label: t('problems.statisticsPage.facts.firstAttempt'),
      icon: 'activity',
    },
    {
      key: 'firstAccepted',
      label: t('problems.statisticsPage.facts.firstAccepted'),
      icon: 'check-circle',
    },
    { key: 'lastAttempt', label: t('problems.statisticsPage.facts.lastAttempt'), icon: 'clock' },
    { key: 'lastAccepted', label: t('problems.statisticsPage.facts.lastAccepted'), icon: 'award' },
    {
      key: 'mostAttemptedProblem',
      label: t('problems.statisticsPage.facts.mostAttempted'),
      icon: 'alert',
    },
    {
      key: 'mostAttemptedForSolveProblem',
      label: t('problems.statisticsPage.facts.mostAttemptedForSolve'),
      icon: 'trending-up',
    },
  ] as const;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader title={t('problems.statisticsPage.facts.title')} />
      <CardContent>
        <Stack spacing={1.5}>
          {items.map((item) => {
            const fact = (statistics?.facts as any)?.[item.key];
            if (!fact) return null;

            return (
              <Stack
                key={item.key}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name={item.icon as any} fontSize={20} />
                  <Typography variant="body2">{item.label}</Typography>
                </Stack>
                <Stack direction="column" spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle2">
                    {fact.problemTitle ?? t('problems.statisticsPage.emptyValue')}
                  </Typography>
                  {fact.datetime ? (
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(fact.datetime).format('YYYY-MM-DD HH:mm')}
                    </Typography>
                  ) : null}
                  {fact.attemptsCount ? (
                    <Typography variant="caption" color="text.secondary">
                      {t('problems.statisticsPage.attemptsCount', { count: fact.attemptsCount })}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            );
          })}
          {!statistics?.facts ? (
            <Typography variant="body2" color="text.secondary">
              {t('problems.statisticsPage.noData')}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

const buildHeatmapFilterOptions = (
  currentYear: number,
  t: (key: string, params?: any) => string,
) => [
  {
    value: DEFAULT_HEATMAP_FILTER,
    label: t('problems.statisticsPage.heatmap.last365Days', {
      defaultValue: 'Last 365 days',
    }),
  },
  ...Array.from(
    { length: Math.max(0, currentYear - HEATMAP_START_YEAR + 1) },
    (_, index) => currentYear - index,
  ).map((year) => ({
    value: String(year),
    label: String(year),
  })),
];

const buildActivityOption = (
  series: number[],
  t: (key: string, params?: any) => string,
): EChartsCoreOption | null => {
  if (!series?.length) return null;

  const points = series.map((value, idx) => {
    const date = dayjs().subtract(series.length - 1 - idx, 'day');
    return [date.valueOf(), value];
  });

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 20, right: 12, top: 24, bottom: 24, containLabel: true },
    xAxis: { type: 'time', boundaryGap: false, axisLabel: { hideOverlap: true } },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { formatter: integerAxisLabelFormatter },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.18 },
        data: points,
        name: t('problems.statisticsPage.activity.seriesLabel'),
      },
    ],
  };
};

const buildHeatmapOption = (
  statistics: ProblemsUserStatisticsHeatmap | undefined,
  themeVars: any,
  t: (key: string, params?: any) => string,
): EChartsCoreOption | null => {
  if (!statistics?.heatmap?.length) return null;
  const weekdayLabels = [
    t('problems.statisticsPage.weekday.sundayShort'),
    t('problems.statisticsPage.weekday.mondayShort'),
    t('problems.statisticsPage.weekday.tuesdayShort'),
    t('problems.statisticsPage.weekday.wednesdayShort'),
    t('problems.statisticsPage.weekday.thursdayShort'),
    t('problems.statisticsPage.weekday.fridayShort'),
    t('problems.statisticsPage.weekday.saturdayShort'),
  ];

  const data = statistics.heatmap.map((entry) => {
    const date = dayjs(entry.date);
    return [date.valueOf(), date.day(), entry.solved ?? 0];
  });

  if (!data.length) return null;

  const maxValue = Math.max(...data.map((item) => item[2] as number), 1);

  return {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const date = dayjs(params.value[0]).format('YYYY-MM-DD');
        return `${date}: ${params.value[2]}`;
      },
    },
    grid: { left: 10, right: 10, top: 12, bottom: 52 },
    xAxis: {
      type: 'time',
      splitNumber: 12,
      axisLabel: { formatter: '{MMM}', hideOverlap: true },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: weekdayLabels,
      axisLine: { show: false },
      axisTick: { show: false },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 8,
      inRange: {
        color: [
          getColor(themeVars.palette.background.paper),
          getColor(themeVars.palette.primary.light),
          getColor(themeVars.palette.primary.main),
        ],
      },
    },
    series: [
      {
        type: 'heatmap',
        data,
      },
    ],
  };
};

const buildBarOption = (
  data: { label: string; solved: number }[],
  t: (key: string) => string,
): EChartsCoreOption | null => {
  if (!data?.length) return null;

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 16, right: 12, top: 20, bottom: 12, containLabel: true },
    xAxis: { type: 'value', minInterval: 1, axisLabel: { formatter: integerAxisLabelFormatter } },
    yAxis: {
      type: 'category',
      data: data.map((item) => item.label),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: data.map((item) => item.solved),
        name: t('problems.statisticsPage.solved'),
        barMaxWidth: 22,
        itemStyle: { borderRadius: [0, 6, 6, 0] },
      },
    ],
  };
};

const buildAttemptsOption = (
  data: ProblemsStatisticsAttemptsChartEntry[],
): EChartsCoreOption | null => {
  if (!data?.length) return null;

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 20, right: 12, top: 20, bottom: 20, containLabel: true },
    xAxis: { type: 'category', data: data.map((item) => item.attemptsCount), boundaryGap: false },
    yAxis: {
      type: 'value',
      max: 100,
      minInterval: 1,
      axisLabel: { formatter: integerAxisLabelFormatter },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.18 },
        data: data.map((item) => item.value),
      },
    ],
  };
};

const ProblemsUserStatisticsPage = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const { state, setField } = useRouteQueryState<{
    selectedHeatmap?: string;
    selectedDays?: number;
  }>({
    defaults: {
      selectedHeatmap: DEFAULT_HEATMAP_FILTER,
      selectedDays: DEFAULT_ACTIVITY_DAYS,
    },
    schema: {
      selectedHeatmap: {
        ...stringParam(),
        param: 'heatmap',
      },
      selectedDays: {
        ...numberParam({ min: 1 }),
        param: 'days',
      },
    },
  });

  const locale = useMemo(() => {
    const lang = i18n.language || 'en';
    if (/^[a-z]{2}[A-Z]{2}$/.test(lang)) {
      return `${lang.slice(0, 2)}-${lang.slice(2)}`;
    }
    return lang.replace('_', '-') || 'en';
  }, [i18n.language]);

  const username = currentUser?.username;
  const heatmapFilterOptions = useMemo(() => buildHeatmapFilterOptions(dayjs().year(), t), [t]);
  const selectedHeatmapFilter = heatmapFilterOptions.some(
    (option) => option.value === state.selectedHeatmap,
  )
    ? (state.selectedHeatmap ?? DEFAULT_HEATMAP_FILTER)
    : DEFAULT_HEATMAP_FILTER;
  const selectedHeatmapYear =
    selectedHeatmapFilter === DEFAULT_HEATMAP_FILTER ? undefined : Number(selectedHeatmapFilter);

  const { data: statistics, isLoading } = useProblemsUserStatistics(username);
  const { data: activityResponse } = useProblemsUserStatisticsActivity(
    username,
    state.selectedDays ?? DEFAULT_ACTIVITY_DAYS,
  );
  const { data: heatmapResponse } = useProblemsUserStatisticsHeatmap(username, selectedHeatmapYear);

  const defaultActivityData = useMemo<ProblemsUserStatisticsActivity | undefined>(
    () =>
      statistics
        ? {
            lastDays: statistics.lastDays,
            meta: {
              lastDays: statistics.meta?.lastDays,
              allowedLastDays: statistics.meta?.allowedLastDays?.length
                ? statistics.meta.allowedLastDays
                : [...ACTIVITY_DAY_OPTIONS],
            },
          }
        : undefined,
    [statistics],
  );

  const defaultHeatmapData = useMemo<ProblemsUserStatisticsHeatmap | undefined>(
    () =>
      statistics
        ? {
            heatmap: statistics.heatmap,
            meta: {
              heatmapRange: statistics.meta?.heatmapRange,
            },
          }
        : undefined,
    [statistics],
  );

  const activityStatistics =
    activityResponse ??
    (state.selectedDays === DEFAULT_ACTIVITY_DAYS ? defaultActivityData : undefined);
  const heatmapStatistics =
    heatmapResponse ??
    (selectedHeatmapFilter === DEFAULT_HEATMAP_FILTER ? defaultHeatmapData : undefined);

  const availableDays = activityStatistics?.meta?.allowedLastDays?.length
    ? activityStatistics.meta.allowedLastDays
    : [...ACTIVITY_DAY_OPTIONS];

  const activityOption = useMemo(
    () => buildActivityOption(activityStatistics?.lastDays?.series ?? [], t),
    [activityStatistics?.lastDays?.series, t],
  );
  const heatmapOption = useMemo(
    () => buildHeatmapOption(heatmapStatistics, theme.vars, t),
    [heatmapStatistics, theme.vars, t],
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
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        title={t('problems.statisticsPage.title')}
        breadcrumb={[
          { label: t('problems.title'), url: resources.Problems },
          { label: t('contests.tabs.statistics'), active: true },
        ]}
      />
      <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 5, md: 6 } }}>
        <Stack spacing={3}>
          {isLoading && (
            <Card variant="outlined">
              <CardContent>
                <LinearProgress />
              </CardContent>
            </Card>
          )}

          {statistics ? (
            <>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <OverviewCard
                    icon="check-circle"
                    label={t('problems.statisticsPage.cards.solved')}
                    value={numberFormatter.format(statistics.general?.solved ?? 0)}
                    subtitle={t('problems.statisticsPage.cards.problems')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <OverviewCard
                    icon="rating"
                    label={t('problems.statisticsPage.cards.rating')}
                    value={numberFormatter.format(statistics.general?.rating ?? 0)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <OverviewCard
                    icon="users"
                    label={t('problems.statisticsPage.cards.rank')}
                    value={String(statistics.general?.rank ?? '-')}
                    subtitle={t('problems.statisticsPage.cards.usersCount', {
                      count: statistics.general?.usersCount ?? 0,
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <OverviewCard
                    icon="award"
                    label={t('problems.statisticsPage.cards.singleAttempt')}
                    value={numberFormatter.format(statistics.facts?.solvedWithSingleAttempt ?? 0)}
                    subtitle={
                      statistics.facts?.solvedWithSingleAttemptPercentage !== undefined
                        ? `${statistics.facts?.solvedWithSingleAttemptPercentage}%`
                        : undefined
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack spacing={3}>
                    <Card variant="outlined">
                      <CardHeader title={t('problems.statisticsPage.profile.languages')} />
                      <CardContent>
                        <Stack spacing={1}>
                          {(statistics.byLang ?? []).map((lang) => (
                            <Stack
                              key={lang.lang}
                              direction="row"
                              spacing={1}
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <AttemptLanguage
                                  lang={lang.lang}
                                  langFull={lang.langFull}
                                  size={28}
                                />
                                <Typography variant="body2">{lang.langFull}</Typography>
                              </Stack>
                              <Chip
                                label={lang.solved}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Stack>
                          ))}
                          {!statistics.byLang?.length ? (
                            <Typography variant="body2" color="text.secondary">
                              {t('problems.statisticsPage.noData')}
                            </Typography>
                          ) : null}
                        </Stack>
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardHeader title={t('problems.statisticsPage.profile.tags')} />
                      <CardContent>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {(statistics.byTag ?? []).map((tag) => (
                            <Chip
                              key={tag.name}
                              label={`${tag.name} (${tag.value})`}
                              size="small"
                            />
                          ))}
                          {!statistics.byTag?.length ? (
                            <Typography variant="body2" color="text.secondary">
                              {t('problems.statisticsPage.noData')}
                            </Typography>
                          ) : null}
                        </Stack>
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardHeader title={t('problems.statisticsPage.profile.topics')} />
                      <CardContent>
                        <Stack spacing={1}>
                          {(statistics.byTopic ?? []).map((topic) => (
                            <Stack
                              key={topic.id}
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <KepIcon name="tags" fontSize={18} />
                                <Typography variant="body2">{topic.topic}</Typography>
                              </Stack>
                              <Chip
                                label={topic.solved}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Stack>
                          ))}
                          {!statistics.byTopic?.length ? (
                            <Typography variant="body2" color="text.secondary">
                              {t('problems.statisticsPage.noData')}
                            </Typography>
                          ) : null}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                  <Stack spacing={3}>
                    <Card variant="outlined">
                      <CardHeader
                        title={t('problems.statisticsPage.activity.title')}
                        action={
                          <ToggleButtonGroup
                            size="small"
                            exclusive
                            value={state.selectedDays ?? DEFAULT_ACTIVITY_DAYS}
                            onChange={(_, value) => value && setField('selectedDays', value)}
                          >
                            {availableDays.map((option) => (
                              <ToggleButton value={option} key={option}>
                                {option}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        }
                      />
                      <CardContent sx={chartContentSx}>
                        {activityOption ? (
                          <ReactEchart
                            echarts={echarts}
                            option={activityOption}
                            style={{ height: 320 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {t('problems.statisticsPage.noData')}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <Card variant="outlined">
                          <CardHeader title={t('problems.statisticsPage.difficulty.title')} />
                          <CardContent>
                            <Stack spacing={1.5}>
                              <Typography variant="body2" color="text.secondary">
                                {t('problems.statisticsPage.difficulty.overview', {
                                  solved: statistics.byDifficulty?.totalSolved ?? 0,
                                  total: statistics.byDifficulty?.totalProblems ?? 0,
                                })}
                              </Typography>
                              {difficultyOptions.map((option) => {
                                const solved = (statistics.byDifficulty as any)?.[option.key] ?? 0;
                                const total =
                                  (statistics.byDifficulty as any)?.[
                                    `all${option.key[0].toUpperCase()}${option.key.slice(1)}`
                                  ] ?? 0;
                                const percent = total ? Math.round((100 * solved) / total) : 0;
                                return (
                                  <Stack key={option.key} spacing={0.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2">{t(option.label)}</Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {solved} / {total} ({percent}%)
                                      </Typography>
                                    </Stack>
                                    <LinearProgress
                                      variant="determinate"
                                      value={percent}
                                      color={difficultyColorByKey[option.key]}
                                      sx={{ height: 8, borderRadius: 1 }}
                                    />
                                  </Stack>
                                );
                              })}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <FactsCard statistics={statistics} />
                      </Grid>
                    </Grid>

                    <Card variant="outlined">
                      <CardHeader
                        title={t('problems.statisticsPage.heatmap.title')}
                        action={
                          <Select
                            size="small"
                            value={selectedHeatmapFilter}
                            onChange={(event) => setField('selectedHeatmap', event.target.value)}
                            sx={{ minWidth: 170 }}
                          >
                            {heatmapFilterOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                      />
                      <CardContent sx={chartContentSx}>
                        {heatmapOption ? (
                          <ReactEchart
                            echarts={echarts}
                            option={heatmapOption}
                            style={{ height: 320 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {t('problems.statisticsPage.noData')}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardHeader title={t('problems.statisticsPage.time.title')} />
                      <CardContent sx={chartContentSx}>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 12, lg: 4 }}>
                            {weekdayOption ? (
                              <ReactEchart
                                echarts={echarts}
                                option={weekdayOption}
                                style={{ height: 360 }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {t('problems.statisticsPage.noData')}
                              </Typography>
                            )}
                          </Grid>
                          <Grid size={{ xs: 12, lg: 4 }}>
                            {monthOption ? (
                              <ReactEchart
                                echarts={echarts}
                                option={monthOption}
                                style={{ height: 360 }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {t('problems.statisticsPage.noData')}
                              </Typography>
                            )}
                          </Grid>
                          <Grid size={{ xs: 12, lg: 4 }}>
                            {periodOption ? (
                              <ReactEchart
                                echarts={echarts}
                                option={periodOption}
                                style={{ height: 360 }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {t('problems.statisticsPage.noData')}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardHeader title={t('problems.statisticsPage.attempts.title')} />
                      <CardContent sx={chartContentSx}>
                        {attemptsChartOption ? (
                          <ReactEchart
                            echarts={echarts}
                            option={attemptsChartOption}
                            style={{ height: 300 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {t('problems.statisticsPage.noData')}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </>
          ) : null}
        </Stack>
      </Box>
    </Stack>
  );
};

export default ProblemsUserStatisticsPage;
