import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Typography } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart, { ReactEchartProps } from 'shared/components/base/ReactEchart';

interface StatisticsChartProps {
  option: ReactEchartProps['option'] | null;
  label: string;
  height?: number;
  loading?: boolean;
  emptyText?: string;
  onEvents?: ReactEchartProps['onEvents'];
}

const StatisticsChart = ({
  option,
  label,
  height = 280,
  loading,
  emptyText,
  onEvents,
}: StatisticsChartProps) => {
  const { t } = useTranslation();
  if (loading)
    return <Skeleton variant="rectangular" height={height} aria-label={t('common.loading')} />;
  if (!option)
    return (
      <Box sx={{ minHeight: 120, display: 'grid', placeItems: 'center', p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyText ?? t('common.statistics.noData')}
        </Typography>
      </Box>
    );
  return (
    <ReactEchart
      echarts={echarts}
      option={option}
      onEvents={onEvents}
      role="img"
      aria-label={label}
      style={{ width: '100%', height }}
      sx={{ minWidth: 0 }}
    />
  );
};

export default StatisticsChart;
