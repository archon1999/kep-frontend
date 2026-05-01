import { ReactNode } from 'react';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import ReactEchart, { type ReactEchartProps } from 'shared/components/base/ReactEchart';

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
  height = 320,
  emptyText,
  onEvents,
  extra,
}: ContestsUserStatisticsPageChartCardProps) => (
  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent sx={{ height: '100%' }}>
      <Stack direction="column" spacing={2} sx={{ height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {extra}
        </Stack>
        {option ? (
          <ReactEchart
            echarts={echarts}
            option={option}
            style={{ width: '100%', height }}
            onEvents={onEvents}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {emptyText}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default ContestsUserStatisticsPageChartCard;
