import { Box, Paper, Skeleton, Stack } from '@mui/material';

const TestCardSkeleton = () => (
  <Paper
    background={1}
    sx={{
      outline: 'none',
      p: 3,
      borderRadius: 3,
    }}
  >
    <Stack direction="column" spacing={2} alignItems="flex-start" justifyContent="space-between">
      <Stack direction="column" spacing={1} sx={{ width: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="rounded" width={48} height={48} />
          <Skeleton variant="text" width={120} height={24} />
        </Stack>

        <Skeleton variant="text" width="70%" height={32} />

        <Stack direction="row" spacing={0.5}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="85%" />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={100} />
        </Stack>

        <Stack direction="column" spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width={90} />
            <Skeleton variant="text" width={70} />
          </Stack>
          <Skeleton variant="rounded" height={8} />
        </Stack>

      </Stack>

      <Box>
        <Skeleton variant="text" width={120} height={36} />
      </Box>
    </Stack>
  </Paper>
);

export default TestCardSkeleton;
