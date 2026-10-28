import { Box, Skeleton, Stack } from '@mui/material';

const TestDetailSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 320px' },
      gridTemplateAreas: { xs: '"header" "start" "results"', md: '"header start" "results start"' },
      alignItems: 'start',
    }}
  >
    <Stack
      gap={3}
      sx={{
        gridArea: 'header',
        p: 'var(--kep-content-inset)',
        borderBottom: '1px solid var(--kep-line)',
      }}
    >
      <Stack direction="row" gap={1.5} alignItems="center">
        <Skeleton variant="rectangular" width={36} height={36} />
        <Skeleton width={180} height={30} />
      </Stack>
      <Stack direction="row" gap={3}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} width="25%" height={70} />
        ))}
      </Stack>
      <Skeleton width="85%" height={54} />
    </Stack>
    <Stack
      gap={3}
      sx={{
        gridArea: 'start',
        alignSelf: 'stretch',
        p: 'var(--kep-content-inset)',
        borderInlineStart: { md: '1px solid var(--kep-line)' },
        borderBottom: { xs: '1px solid var(--kep-line)', md: 0 },
      }}
    >
      <Skeleton width="80%" height={32} />
      <Skeleton width={130} height={60} />
      <Skeleton variant="rectangular" height={3} />
      <Skeleton width="60%" height={44} />
      <Skeleton variant="rounded" height={38} />
    </Stack>
    <Box sx={{ gridArea: 'results', minWidth: 0 }}>
      <Stack direction="row" gap={2} sx={{ px: 'var(--kep-content-inset)', py: 2 }}>
        <Skeleton width={120} height={30} />
        <Skeleton width={120} height={30} />
      </Stack>
      <Skeleton variant="rectangular" height={48} />
      {Array.from({ length: 5 }, (_, index) => (
        <Stack
          key={index}
          direction="row"
          gap={2}
          alignItems="center"
          sx={{
            px: 'var(--kep-content-inset)',
            minHeight: 68,
            borderBottom: '1px solid var(--kep-line)',
          }}
        >
          <Skeleton width={24} height={24} />
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton width="35%" height={24} />
          <Skeleton width={54} height={28} sx={{ ml: 'auto' }} />
        </Stack>
      ))}
    </Box>
  </Box>
);
export default TestDetailSkeleton;
