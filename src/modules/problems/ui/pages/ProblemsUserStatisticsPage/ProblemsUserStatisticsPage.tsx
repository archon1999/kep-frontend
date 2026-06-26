import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
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
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import {
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  useProblemsUserStatistics,
  useProblemsUserStatisticsActivity,
  useProblemsUserStatisticsHeatmap,
} from 'modules/problems/application/queries';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import {
  ProblemsStatisticsAttemptsChartEntry,
  ProblemsStatisticsTagStat,
  ProblemsUserStatisticsActivity,
  ProblemsUserStatisticsHeatmap,
} from 'modules/problems/domain/entities/problem.entity';
import KepIcon from 'shared/components/base/KepIcon';
import ReactEchart from 'shared/components/base/ReactEchart';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import {
  formatMachineDateTime,
  getCurrentYear,
  getDateTimeValue,
  subtractFromNow,
} from 'shared/lib/dateTime';
import { getColor } from 'shared/lib/echart-utils';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { numberParam, stringParam } from 'shared/lib/queryParams';
import ProblemsUserStatisticsPageFactsCard from './ProblemsUserStatisticsPageFactsCard.tsx';
import ProblemsUserStatisticsPageOverviewCard from './ProblemsUserStatisticsPageOverviewCard.tsx';

echarts.use([
  CalendarComponent,
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
const countTextSx = {
  color: 'primary.main',
  fontWeight: 800,
  lineHeight: 1,
  whiteSpace: 'nowrap',
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
    const date = subtractFromNow(series.length - 1 - idx, 'day');
    return [getDateTimeValue(date), value];
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

  const data = statistics.heatmap.map((entry) => [entry.date, entry.solved ?? 0]);
  const range =
    statistics.meta?.heatmapRange?.from && statistics.meta?.heatmapRange?.to
      ? [statistics.meta.heatmapRange.from, statistics.meta.heatmapRange.to]
      : [statistics.heatmap[0]?.date, statistics.heatmap[statistics.heatmap.length - 1]?.date];

  if (!data.length) return null;

  const maxValue = Math.max(...data.map((item) => item[1] as number), 1);
  const textColor = getColor(themeVars.palette.text.secondary);
  const paperColor = getColor(themeVars.palette.background.paper);
  const emptyCellColor = getColor(themeVars.palette.background.default) || paperColor;
  const dividerColor = getColor(themeVars.palette.divider);
  const primaryLightColor = getColor(themeVars.palette.primary.light);
  const primaryMainColor = getColor(themeVars.palette.primary.main);

  return {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: paperColor,
      borderColor: dividerColor,
      textStyle: {
        color: getColor(themeVars.palette.text.primary),
      },
      formatter: (params: any) => {
        const date = formatMachineDateTime(params.value[0], 'isoDate');
        return `${date}: ${params.value[1]}`;
      },
    },
    calendar: {
      top: 0,
      left: 60,
      right: 18,
      bottom: 52,
      range,
      cellSize: ['auto', 24],
      splitLine: {
        show: true,
        lineStyle: {
          color: dividerColor,
          width: 0.5,
        },
      },
      itemStyle: {
        color: emptyCellColor,
        borderColor: dividerColor,
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
      monthLabel: {
        margin: 14,
        color: textColor,
        formatter: (value: string) => formatMachineDateTime(value, 'monthShort'),
      },
      dayLabel: {
        firstDay: 0,
        margin: 14,
        color: textColor,
        nameMap: weekdayLabels,
      },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 8,
      textStyle: {
        color: textColor,
      },
      inRange: {
        color: [paperColor, primaryLightColor, primaryMainColor],
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data,
        itemStyle: {
          borderRadius: 4,
          borderWidth: 1,
          borderColor: paperColor,
        },
        emphasis: {
          itemStyle: {
            borderRadius: 4,
            borderWidth: 1,
            borderColor: getColor(themeVars.palette.primary.contrastText),
          },
        },
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

  const username = currentUser?.username;
  const heatmapFilterOptions = useMemo(() => buildHeatmapFilterOptions(getCurrentYear(), t), [t]);
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
  const tagGroups = useMemo(() => {
    const tags = [...(statistics?.byTag ?? [])].sort((a, b) => b.value - a.value);
    const hasCategories = tags.some((tag) => tag.categoryId || tag.categoryTitle);

    if (!hasCategories) {
      return [{ key: 'all', title: undefined, total: 0, tags }];
    }

    const groups = new Map<
      string,
      {
        key: string;
        title: string;
        code?: string;
        total: number;
        tags: ProblemsStatisticsTagStat[];
      }
    >();

    tags.forEach((tag) => {
      const key = String(tag.categoryId ?? tag.categoryCode ?? 'other');
      const group = groups.get(key) ?? {
        key,
        title: tag.categoryTitle ?? t('problems.statisticsPage.profile.tags'),
        code: tag.categoryCode,
        total: 0,
        tags: [],
      };

      group.total += tag.value;
      group.tags.push(tag);
      groups.set(key, group);
    });

    return [...groups.values()].sort((a, b) => b.total - a.total);
  }, [statistics?.byTag, t]);

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
                  <ProblemsUserStatisticsPageOverviewCard
                    icon="solved"
                    label={t('problems.statisticsPage.cards.solved')}
                    value={numberFormatter.format(statistics.general?.solved ?? 0)}
                    subtitle={t('problems.statisticsPage.cards.problems')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <ProblemsUserStatisticsPageOverviewCard
                    icon="rating"
                    label={t('problems.statisticsPage.cards.rating')}
                    value={numberFormatter.format(statistics.general?.rating ?? 0)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <ProblemsUserStatisticsPageOverviewCard
                    icon="users"
                    label={t('problems.statisticsPage.cards.rank')}
                    value={String(statistics.general?.rank ?? '-')}
                    subtitle={t('problems.statisticsPage.cards.usersCount', {
                      count: statistics.general?.usersCount ?? 0,
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                  <ProblemsUserStatisticsPageOverviewCard
                    icon="attempt"
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
                              <Typography variant="body2" sx={countTextSx}>
                                x{numberFormatter.format(lang.solved)}
                              </Typography>
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
                      <CardHeader
                        title={t('problems.statisticsPage.profile.byCategoryAndTags', {
                          defaultValue: 'By Category & By Tags',
                        })}
                      />
                      <CardContent>
                        {statistics.byTag?.length ? (
                          <Stack spacing={1.25}>
                            {tagGroups.map((group) =>
                              group.title ? (
                                <Accordion
                                  key={group.key}
                                  sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    bgcolor: 'action.hover',
                                    '&.Mui-expanded': {
                                      bgcolor: 'background.paper',
                                    },
                                  }}
                                >
                                  <AccordionSummary>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      justifyContent="space-between"
                                      sx={{ width: 1, minWidth: 0 }}
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ minWidth: 0 }}
                                      >
                                        <KepIcon name="tags" fontSize={18} />
                                        <Typography variant="subtitle2" noWrap>
                                          {group.title}
                                        </Typography>
                                      </Stack>
                                      <Typography variant="caption" sx={countTextSx}>
                                        x{numberFormatter.format(group.total)}
                                      </Typography>
                                    </Stack>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ pt: 0 }}>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                      {group.tags.map((tag) => (
                                        <Box
                                          key={`${group.key}-${tag.name}`}
                                          sx={{
                                            px: 1.25,
                                            py: 0.5,
                                            borderRadius: 999,
                                            bgcolor: 'action.hover',
                                            typography: 'body2',
                                            fontWeight: 600,
                                          }}
                                        >
                                          {tag.name}{' '}
                                          <Box component="span" sx={countTextSx}>
                                            x{numberFormatter.format(tag.value)}
                                          </Box>
                                        </Box>
                                      ))}
                                    </Stack>
                                  </AccordionDetails>
                                </Accordion>
                              ) : (
                                <Stack key={group.key} spacing={1}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <KepIcon name="tags" fontSize={18} />
                                    <Typography variant="subtitle2">
                                      {t('problems.statisticsPage.profile.byTags', {
                                        defaultValue: 'By Tags',
                                      })}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {group.tags.map((tag) => (
                                      <Box
                                        key={`${group.key}-${tag.name}`}
                                        sx={{
                                          px: 1.25,
                                          py: 0.5,
                                          borderRadius: 999,
                                          bgcolor: 'action.hover',
                                          typography: 'body2',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {tag.name}{' '}
                                        <Box component="span" sx={countTextSx}>
                                          x{numberFormatter.format(tag.value)}
                                        </Box>
                                      </Box>
                                    ))}
                                  </Stack>
                                </Stack>
                              ),
                            )}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {t('problems.statisticsPage.noData')}
                          </Typography>
                        )}
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
                        <ProblemsUserStatisticsPageFactsCard statistics={statistics} />
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
