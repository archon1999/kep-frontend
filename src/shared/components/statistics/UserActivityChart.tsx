import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type { ReactEchartProps } from 'shared/components/base/ReactEchart';
import useChartPalette from 'shared/hooks/useChartPalette';
import { formatDateTime } from 'shared/lib/dateTime';
import { getColor } from 'shared/lib/echart-utils';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { getPastDates } from 'shared/lib/utils';
import type { UserActivityStatistics } from 'shared/types/userActivity';
import StatisticsChart from './StatisticsChart';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegacyGridContainLabel,
  CanvasRenderer,
]);

interface Props {
  data?: UserActivityStatistics | null;
  dates?: string[];
  height?: number;
  loading?: boolean;
}

export default function UserActivityChart({ data, dates, height = 230, loading }: Props) {
  const { t, i18n } = useTranslation();
  const palette = useChartPalette();
  const primary = getColor(palette.primary.main);
  const secondary = getColor(palette.secondary.main);
  const formatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 0 }, i18n.resolvedLanguage),
    [i18n.resolvedLanguage],
  );
  const option = useMemo<ReactEchartProps['option'] | null>(() => {
    if (!data || (!data.newUsers.series.length && !data.activeUsers.series.length)) return null;
    const length = Math.max(data.newUsers.series.length, data.activeUsers.series.length);
    const align = (values: number[]) => [
      ...Array(Math.max(0, length - values.length)).fill(null),
      ...values,
    ];
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (value: number) =>
          formatter.format(value) + ' ' + t('homePage.userActivity.tooltipSuffix'),
      },
      grid: { left: 8, right: 18, top: 20, bottom: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: (dates?.length === length ? dates : getPastDates(length)).map((date) =>
          formatDateTime(date, 'monthDay'),
        ),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { hideOverlap: true, margin: 14, interval: 'auto', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        minInterval: 1,
        splitNumber: 4,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { margin: 12, formatter: (value: number) => formatter.format(value) },
      },
      series: [
        {
          name: t('homePage.userActivity.series.newUsers'),
          type: 'bar',
          data: align(data.newUsers.series),
          barMaxWidth: 14,
          itemStyle: { color: alpha(secondary, 0.55), borderRadius: [2, 2, 0, 0] },
          emphasis: { itemStyle: { color: secondary } },
        },
        {
          name: t('homePage.userActivity.series.activeUsers'),
          type: 'line',
          data: align(data.activeUsers.series),
          smooth: 0.22,
          showSymbol: false,
          symbolSize: 7,
          lineStyle: { width: 2.5, color: primary, cap: 'round' },
          itemStyle: { color: primary },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: alpha(primary, 0.17) },
              { offset: 1, color: alpha(primary, 0) },
            ]),
          },
        },
      ],
    };
  }, [data, dates, primary, secondary, formatter, t, i18n.resolvedLanguage]);

  return (
    <StatisticsChart
      option={option}
      label={t('homePage.userActivity.title')}
      height={height}
      loading={loading}
    />
  );
}
