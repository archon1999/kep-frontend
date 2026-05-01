import { Box, Card, Skeleton, Stack } from '@mui/material';

const ProblemEditorSkeleton = () => {
  return (
    <Card
      background={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          px: 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
          <Skeleton variant="rounded" width={200} height={42} />
          <Skeleton variant="rounded" width={140} height={42} />
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ height: '100%' }}>
          <Skeleton variant="rounded" height="48%" />
          <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
            <Skeleton variant="rounded" height={36} width={220} />
            <Skeleton variant="rounded" height="100%" />
          </Stack>
        </Stack>
      </Box>

      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          px: 3,
          py: 1.25,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={2}>
          <Skeleton variant="text" width={140} />
          <Skeleton variant="text" width={220} />
        </Stack>
      </Box>
    </Card>
  );
};

export default ProblemEditorSkeleton;
