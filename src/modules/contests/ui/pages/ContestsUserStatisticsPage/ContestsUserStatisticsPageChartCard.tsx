import { ReactNode } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { type ReactEchartProps } from 'shared/components/base/ReactEchart';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';

interface ContestsUserStatisticsPageChartCardProps {
  title: string;
  option: EChartsCoreOption | null;
  height?: number;
  emptyText: string;
  onEvents?: ReactEchartProps['onEvents'];
  extra?: ReactNode;
}

const ContestsUserStatisticsPageChartCard = ({
  title,
  option,
  height = 280,
  emptyText,
  onEvents,
  extra,
}: ContestsUserStatisticsPageChartCardProps) => (
  <StatisticsSection title={title} action={extra}>
    <StatisticsChart
      label={title}
      option={option}
      height={height}
      emptyText={emptyText}
      onEvents={onEvents}
    />
  </StatisticsSection>
);

export default ContestsUserStatisticsPageChartCard;
