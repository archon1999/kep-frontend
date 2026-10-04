import { Card, Skeleton, Stack } from '@mui/material';

const TopicCardSkeleton = () => (
  <Card
    elevation={0}
    aria-hidden="true"
    sx={{ borderRadius: 4, bgcolor: 'transparent', height: 1 }}
  >
    <Stack
      component="figure"
      justifyContent="center"
      alignItems="center"
      sx={{
        m: 0,
        aspectRatio: 1.27,
        width: 1,
        borderRadius: 4,
        bgcolor: 'background.elevation1',
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rounded" sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 } }} />
    </Stack>
    <Stack spacing={0.75} sx={{ p: 2 }}>
      <Skeleton width="75%" height={24} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Skeleton variant="rounded" width={82} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton width={28} height={18} />
      </Stack>
    </Stack>
  </Card>
);

export default TopicCardSkeleton;
