import { Box, Skeleton, Stack } from '@mui/material';
import { StatisticsChartSkeleton } from 'shared/components/statistics/StatisticsSkeleton';

const section = { p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider', minWidth: 0 };

export default function DashboardSkeleton() {
  return (
    <Box aria-busy="true">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{ px: { xs: 2, md: 3 }, py: 2, borderRight: 1, borderColor: 'divider' }}
          >
            <Skeleton variant="rectangular" width={24} height={24} />
            <Box>
              <Skeleton width={64} height={20} />
              <Skeleton width={80} height={36} />
            </Box>
          </Stack>
        ))}
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ ...section, py: 2 }}>
        {[96, 110, 92, 110, 86, 86, 126].map((width, index) => (
          <Skeleton key={index} variant="rectangular" width={width} height={32} />
        ))}
      </Stack>
      <Box sx={section}>
        <Skeleton width={160} height={28} sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.5,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} variant="rectangular" height={108} />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(0, 1fr)' },
        }}
      >
        <Box sx={{ ...section, borderRight: { lg: '1px solid var(--kep-line)' } }}>
          <Stack direction="row" justifyContent="space-between" mb={2.5}>
            <Skeleton width={160} height={28} />
            <Skeleton width={80} height={20} />
          </Stack>
          <Stack direction="row" gap={2} sx={{ mb: 0.75 }}>
            {[0, 1].map((index) => (
              <Box key={index} sx={{ flex: 1 }}>
                <Skeleton width={84} height={20} />
                <Skeleton width={120} height={42} />
              </Box>
            ))}
          </Stack>
          <StatisticsChartSkeleton height={210} />
        </Box>
        <Box sx={section}>
          <Skeleton width="65%" height={28} sx={{ mb: 1 }} />
          {[0, 1, 2, 3].map((index) => (
            <Stack
              key={index}
              direction="row"
              gap={1.5}
              alignItems="center"
              sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider' }}
            >
              <Skeleton variant="rectangular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="80%" height={20} />
                <Skeleton width="50%" height={18} />
              </Box>
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
