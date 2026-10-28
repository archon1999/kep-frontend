import type { Palette } from '@mui/material/styles';
import type { EChartsCoreOption } from 'echarts/core';
import type {
  ProblemsStatisticsAttemptsChartEntry,
  ProblemsUserStatisticsHeatmap,
} from 'modules/problems/domain/entities/problem.entity';
import {
  formatDateTimePattern,
  formatMachineDateTime,
  getDateTimeValue,
  subtractFromNow,
} from 'shared/lib/dateTime';
import { getColor } from 'shared/lib/echart-utils';

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

export const buildActivityOption = (
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
        smooth: false,
        showSymbol: false,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.08 },
        data: points,
        name: t('problems.statisticsPage.activity.seriesLabel'),
      },
    ],
  };
};

export const buildHeatmapOption = (
  statistics: ProblemsUserStatisticsHeatmap | undefined,
  palette: Palette,
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
  const textColor = getColor(palette.text.secondary);
  const paperColor = getColor(palette.background.paper);
  const emptyCellColor = getColor(palette.background.default) || paperColor;
  const dividerColor = getColor(palette.divider);
  const primaryLightColor = getColor(palette.primary.light);
  const primaryMainColor = getColor(palette.primary.main);

  return {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: paperColor,
      borderColor: dividerColor,
      textStyle: {
        color: getColor(palette.text.primary),
      },
      formatter: (params: any) => {
        const date = formatMachineDateTime(params.value[0], 'isoDate');
        return `${date}: ${params.value[1]}`;
      },
    },
    calendar: {
      top: 28,
      left: 60,
      right: 18,
      bottom: 52,
      range,
      cellSize: ['auto', 16],
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
        formatter: ({ yyyy, MM }: { yyyy: string; MM: string }) =>
          formatDateTimePattern(`${yyyy}-${MM}-01`, 'MMM'),
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
      text: [String(maxValue), '0'],
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
          borderRadius: 0,
          borderWidth: 1,
          borderColor: paperColor,
        },
        emphasis: {
          itemStyle: {
            borderRadius: 0,
            borderWidth: 1,
            borderColor: getColor(palette.primary.contrastText),
          },
        },
      },
    ],
  };
};

export const buildBarOption = (
  data: { label: string; solved: number }[],
  t: (key: string) => string,
): EChartsCoreOption | null => {
  if (!data?.length) return null;

  const orderedData = [...data].sort((a, b) => b.solved - a.solved);

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 16, right: 12, top: 20, bottom: 12, containLabel: true },
    xAxis: { type: 'value', minInterval: 1, axisLabel: { formatter: integerAxisLabelFormatter } },
    yAxis: {
      type: 'category',
      inverse: true,
      data: orderedData.map((item) => item.label),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: orderedData.map((item) => item.solved),
        name: t('problems.statisticsPage.solved'),
        barMaxWidth: 22,
        itemStyle: { borderRadius: 0 },
      },
    ],
  };
};

export const buildAttemptsOption = (
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
      axisLabel: { formatter: '{value}%' },
    },
    series: [
      {
        type: 'line',
        smooth: false,
        showSymbol: false,
        areaStyle: { opacity: 0.08 },
        data: data.map((item) => item.value),
      },
    ],
  };
};
