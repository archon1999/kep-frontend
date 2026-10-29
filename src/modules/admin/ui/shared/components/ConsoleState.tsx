import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Skeleton, Stack } from '@mui/material';
import { errorData, errorText } from '../helpers';

export const ConsoleError = ({ error, retry }: { error: unknown; retry?: () => void }) => {
  const { t } = useTranslation();
  if (!error) return null;
  const text = errorText(errorData(error));
  return (
    <Alert
      severity="error"
      role="alert"
      sx={{ m: { xs: 2, md: 3 }, overflowWrap: 'anywhere' }}
      action={
        retry ? (
          <Button color="inherit" onClick={retry}>
            {t('admin.console.retry')}
          </Button>
        ) : undefined
      }
    >
      {text || t('admin.console.loadError')}
    </Alert>
  );
};

export const ConsoleSkeleton = ({
  kind = 'list',
  header = false,
}: {
  kind?: 'list' | 'dashboard' | 'form' | 'catalog';
  header?: boolean;
}) => (
  <Box sx={{ p: { xs: 2, md: 3 } }} aria-busy="true">
    {header && (
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Skeleton width="35%" height={48} />
        <Skeleton width={120} height={42} />
      </Stack>
    )}
    {kind === 'dashboard' ? (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} variant="rectangular" height={112} />
        ))}
      </Box>
    ) : null}
    {kind === 'form' || kind === 'catalog' || kind === 'dashboard' ? (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: kind === 'catalog' ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        {Array.from({ length: kind === 'form' ? 6 : 9 }, (_, index) => (
          <Box key={index}>
            <Skeleton width="38%" height={24} sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              height={kind === 'form' ? 48 : kind === 'catalog' ? 64 : 112}
            />
          </Box>
        ))}
        {kind === 'form' && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Skeleton width="24%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={240} />
          </Box>
        )}
      </Box>
    ) : (
      <Stack spacing={0}>
        {Array.from({ length: 8 }, (_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Skeleton width={40} height={24} />
            <Skeleton width="45%" height={24} />
            <Skeleton width="20%" sx={{ ml: 'auto' }} />
          </Box>
        ))}
      </Stack>
    )}
  </Box>
);
