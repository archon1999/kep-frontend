import { Card, CardContent, Divider, Skeleton, Stack, Box } from '@mui/material';

const ProblemDescriptionSkeleton = () => {
  return (
    <Card
      background={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2.5, py: 1.25 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Skeleton variant="rounded" width={120} height={32} />
          <Skeleton variant="rounded" width={110} height={32} />
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="rounded" width={140} height={32} />
        </Stack>
      </Box>

      <Divider />

      <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="column" spacing={1}>
            <Skeleton variant="text" width="60%" height={36} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Skeleton variant="rounded" width={120} height={28} />
              <Skeleton variant="rounded" width={140} height={28} />
              <Skeleton variant="rounded" width={140} height={28} />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Skeleton variant="text" width={180} height={28} />
            <Skeleton variant="rounded" height={96} />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Skeleton variant="text" width={200} height={28} />
            <Skeleton variant="rounded" height={96} />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={160} height={26} />
            <Stack direction="row" spacing={1.25}>
              <Skeleton variant="rounded" height={108} />
              <Skeleton variant="rounded" height={108} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          px: 3,
          py: 1.75,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Skeleton variant="rounded" height={36} width={220} />
      </Box>
    </Card>
  );
};

export default ProblemDescriptionSkeleton;
