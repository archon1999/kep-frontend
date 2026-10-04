import { Box, Divider, Paper, Skeleton, Stack } from '@mui/material';

const TestDetailSkeleton = () => (
  <Box
    role="status"
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        md: 'minmax(0, 1fr) 280px',
        lg: 'minmax(0, 1fr) 300px',
      },
      gridTemplateAreas: {
        xs: '"header" "start" "results"',
        md: '"header start" "results start"',
      },
      columnGap: { md: 3, lg: 4 },
      rowGap: 3,
      alignItems: 'start',
    }}
  >
    <Stack gap={2} sx={{ gridArea: 'header' }} aria-hidden="true">
      <Stack direction="row" gap={1.25} alignItems="center">
        <Skeleton variant="rounded" width={32} height={32} />
        <Skeleton width={160} height={22} />
      </Stack>
      <Skeleton width="75%" height={34} />
      <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
        <Skeleton variant="rounded" width={52} height={24} />
        <Skeleton width={68} height={18} />
        <Skeleton width={64} height={18} />
        <Skeleton width={88} height={18} />
      </Stack>
      <Skeleton width="95%" height={22} />
      <Stack direction="row" gap={1}>
        <Skeleton variant="rounded" width={140} height={24} />
      </Stack>
    </Stack>
    <Paper
      elevation={0}
      aria-hidden="true"
      sx={{ gridArea: 'start', p: 2.5, borderRadius: 4, bgcolor: 'background.elevation1' }}
    >
      <Skeleton width={128} height={22} sx={{ mb: 2 }} />
      <Skeleton width={84} height={32} />
      <Skeleton width={108} height={18} sx={{ mt: 0.5 }} />
      <Skeleton variant="rounded" height={4} sx={{ mt: 1.5 }} />
      <Stack direction="row" justifyContent="space-between" gap={1.5} sx={{ mt: 2 }}>
        <Skeleton width={80} height={18} />
        <Skeleton width={92} height={18} />
      </Stack>
      <Divider sx={{ my: 2.5 }} />
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Skeleton width={40} height={22} />
        <Skeleton width={34} height={22} />
      </Stack>
      <Skeleton variant="rounded" sx={{ height: { xs: 44, md: 36 } }} />
    </Paper>
    <Box sx={{ gridArea: 'results', minWidth: 0 }} aria-hidden="true">
      <Stack direction="row" gap={3} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Skeleton width={132} height={48} />
        <Skeleton width={124} height={48} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        sx={{ height: 48, borderBottom: 1, borderColor: 'divider' }}
      >
        <Skeleton width={40} height={18} />
        <Skeleton width={100} height={18} />
        <Skeleton width={44} height={18} sx={{ ml: 'auto' }} />
      </Stack>
      {Array.from({ length: 4 }, (_, index) => (
        <Stack
          key={index}
          direction="row"
          alignItems="center"
          gap={2}
          sx={{ height: 56, borderBottom: index < 3 ? 1 : 0, borderColor: 'divider' }}
        >
          <Skeleton width={40} height={18} />
          <Skeleton width={120} height={22} />
          <Skeleton width={56} height={22} sx={{ ml: 'auto' }} />
        </Stack>
      ))}
    </Box>
  </Box>
);

export default TestDetailSkeleton;
