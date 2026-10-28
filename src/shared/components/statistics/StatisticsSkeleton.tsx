import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import { statisticsChartHeight } from 'app/theme/styles/statistics';
import StatisticsMetric from './StatisticsMetric';
import StatisticsSection from './StatisticsSection';

export const StatisticsMetricSkeleton = ({
  label,
  subtitle = false,
  icon = false,
}: {
  label: string;
  subtitle?: boolean;
  icon?: boolean;
}) => (
  <StatisticsMetric
    label={label}
    value={
      <Skeleton
        width={88}
        sx={{ height: '1em', display: 'inline-block', verticalAlign: 'middle' }}
      />
    }
    subtitle={
      subtitle ? (
        <Skeleton
          width="70%"
          sx={{ height: '1em', display: 'inline-block', verticalAlign: 'middle' }}
        />
      ) : undefined
    }
    icon={icon ? <Skeleton variant="rectangular" width={20} height={20} /> : undefined}
  />
);

export const StatisticsChartSkeleton = ({
  height = statisticsChartHeight,
}: {
  height?: number;
}) => {
  const { t } = useTranslation();
  return (
    <Box
      aria-label={t('common.loading')}
      sx={{ height, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Stack
        direction="row"
        sx={{
          flex: 1,
          minHeight: 0,
          gap: 1,
          alignItems: 'flex-end',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {[38, 62, 49, 79, 55, 92, 72, 58, 84, 64, 45, 68].map((size, index) => (
          <Skeleton key={index} variant="rectangular" sx={{ flex: 1, height: `${size}%` }} />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} width="12%" height={15} />
        ))}
      </Stack>
    </Box>
  );
};

export const StatisticsRowsSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Stack spacing={0}>
    {Array.from({ length: rows }, (_, index) => (
      <Stack
        key={index}
        direction="row"
        alignItems="center"
        gap={1.5}
        sx={{ py: 1.25, borderBottom: 1, borderColor: 'divider' }}
      >
        <Skeleton variant="rectangular" width={28} height={28} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width={`${76 - (index % 3) * 12}%`} height={18} />
          <Skeleton width="40%" height={14} />
        </Box>
        <Skeleton width={38} height={23} />
      </Stack>
    ))}
  </Stack>
);

export const StatisticsSectionSkeleton = ({
  title,
  height = statisticsChartHeight,
  rows,
  action,
}: {
  title: string;
  height?: number;
  rows?: number;
  action?: ReactNode;
}) => (
  <StatisticsSection title={title} action={action}>
    {rows ? <StatisticsRowsSkeleton rows={rows} /> : <StatisticsChartSkeleton height={height} />}
  </StatisticsSection>
);
