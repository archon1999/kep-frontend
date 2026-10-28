import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';

const TestPassSkeleton = () => {
  const { t } = useTranslation();
  return (
    <FramedPage>
      <PageHeader
        title={t('tests.passTitle')}
        actionComponent={<Skeleton width={140} height={54} />}
      />
      <Box
        role="status"
        aria-label={t('tests.loading')}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 320px' } }}
      >
        <Stack gap={3} sx={{ p: 'var(--kep-content-inset)' }}>
          <Stack direction="row" justifyContent="space-between">
            <Skeleton width={140} />
            <Skeleton width={90} />
          </Stack>
          <Skeleton width="85%" height={28} />
          <Skeleton width="65%" height={28} />
          <Skeleton variant="rectangular" height={240} />
          <Skeleton variant="rounded" height={38} width={180} sx={{ alignSelf: 'flex-end' }} />
        </Stack>
        <Stack
          gap={3}
          sx={{
            p: 'var(--kep-content-inset)',
            display: { xs: 'none', md: 'flex' },
            borderInlineStart: '1px solid var(--kep-line)',
          }}
        >
          <Skeleton height={32} width="70%" />
          <Skeleton height={3} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1 }}>
            {Array.from({ length: 15 }, (_, i) => (
              <Skeleton key={i} variant="rectangular" height={44} />
            ))}
          </Box>
          <Skeleton variant="rounded" height={38} />
        </Stack>
      </Box>
    </FramedPage>
  );
};
export default TestPassSkeleton;
