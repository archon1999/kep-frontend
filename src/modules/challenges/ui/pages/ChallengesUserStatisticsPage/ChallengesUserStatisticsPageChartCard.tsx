import { ReactNode } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import ReactEchart from 'shared/components/base/ReactEchart.tsx';

type ChallengesUserStatisticsPageChartCardProps = {
  title: string;
  option: EChartsCoreOption | null;
  height?: number;
  emptyText: string;
  extra?: ReactNode;
  onEvents?: Record<string, (params?: any) => void>;
};

const ChallengesUserStatisticsPageChartCard = ({
  title,
  option,
  height = 320,
  emptyText,
  extra,
  onEvents,
}: ChallengesUserStatisticsPageChartCardProps) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent sx={{ height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
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

export default ChallengesUserStatisticsPageChartCard;
