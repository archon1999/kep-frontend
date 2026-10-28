import { useTranslation } from 'react-i18next';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { ArenaPlayerStatistics } from 'modules/arena/domain/entities/arena-player-statistics.entity';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import useChartPalette from 'shared/hooks/useChartPalette';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

const ArenaPlayerResultsChart = ({ statistics }: { statistics?: ArenaPlayerStatistics }) => {
  const { t } = useTranslation();
  const palette = useChartPalette();
  const rows = [
    {
      name: t('arena.statisticsLabels.wins'),
      value: statistics?.wins ?? 0,
      color: palette.success.main,
    },
    {
      name: t('arena.statisticsLabels.draws'),
      value: statistics?.draws ?? 0,
      color: palette.text.disabled,
    },
    {
      name: t('arena.statisticsLabels.losses'),
      value: statistics?.losses ?? 0,
      color: palette.error.main,
    },
  ];
  const option = rows.some((row) => row.value > 0)
    ? {
        tooltip: { trigger: 'axis' },
        grid: { top: 8, right: 32, bottom: 24, left: 85 },
        xAxis: { type: 'value', minInterval: 1 },
        yAxis: {
          type: 'category',
          inverse: true,
          data: rows.map((row) => row.name),
          axisTick: { show: false },
          axisLine: { show: false },
        },
        series: [
          {
            type: 'bar',
            barMaxWidth: 18,
            label: { show: true, position: 'right', color: palette.text.primary },
            data: rows.map((row) => ({ value: row.value, itemStyle: { color: row.color } })),
          },
        ],
      }
    : null;
  return <StatisticsChart label={t('arena.columns.results')} option={option} height={200} />;
};

export default ArenaPlayerResultsChart;
