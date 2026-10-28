import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';
import ProblemEditorSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorSkeleton';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';

const DuelWorkspaceSkeleton = () => {
  const { t } = useTranslation();
  return (
    <WorkspaceRoot role="status" aria-label={t('common.loading')}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        sx={{ px: { xs: 1.5, md: 3 }, minHeight: 52, borderBottom: '1px solid var(--kep-line)' }}
      >
        <Skeleton width={32} height={32} />
        <Skeleton width={160} height={28} />
        <Box sx={{ flex: 1 }} />
        <Skeleton width={100} height={28} />
        <Skeleton width={200} height={36} sx={{ display: { xs: 'none', md: 'block' } }} />
      </Stack>
      <Stack
        direction="row"
        gap={1}
        sx={{
          px: 2,
          minHeight: 40,
          alignItems: 'center',
          borderBottom: '1px solid var(--kep-line)',
        }}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} width={32} height={24} />
        ))}
      </Stack>
      <Skeleton
        variant="rectangular"
        height={45}
        sx={{ display: { xs: 'block', md: 'none' }, flexShrink: 0 }}
      />
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '46fr 54fr' },
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <ProblemDescriptionSkeleton />
        <Box
          sx={{
            minHeight: 0,
            display: { xs: 'none', md: 'block' },
            borderInlineStart: '1px solid var(--kep-line)',
          }}
        >
          <ProblemEditorSkeleton />
        </Box>
      </Box>
      <Stack
        direction="row"
        gap={1}
        sx={{
          p: 1.25,
          display: { xs: 'flex', md: 'none' },
          borderTop: '1px solid var(--kep-line)',
        }}
      >
        <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
      </Stack>
      <Stack
        direction="row"
        gap={3}
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: 48, borderTop: '1px solid var(--kep-line)' }}
      >
        <Skeleton width={140} height={28} />
        <Skeleton width={140} height={28} />
      </Stack>
    </WorkspaceRoot>
  );
};
export default DuelWorkspaceSkeleton;
