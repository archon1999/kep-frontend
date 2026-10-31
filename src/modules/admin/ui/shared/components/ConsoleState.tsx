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
  kind?: 'list' | 'form' | 'catalog';
  header?: boolean;
}) => (
  <Box sx={{ p: { xs: 2, md: 3 } }} aria-busy="true">
    {header && (
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Skeleton width="35%" height={48} />
        <Skeleton width={120} height={42} />
      </Stack>
    )}
    {kind === 'form' ? (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
          gap: 3,
        }}
      >
        <Box>
          <Stack direction="row" spacing={2} mb={3}>
            {[90, 90, 80, 80].map((width, index) => (
              <Skeleton key={index} width={width} height={42} />
            ))}
          </Stack>
          <Skeleton width="30%" height={22} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={44} sx={{ mb: 3 }} />
          <Skeleton width="24%" height={22} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={220} />
          <Skeleton width="30%" height={22} sx={{ my: 2 }} />
          <Skeleton variant="rectangular" height={160} />
        </Box>
        <Box sx={{ borderLeft: { lg: '1px solid var(--kep-line)' }, px: 2 }}>
          <Skeleton width="70%" height={24} sx={{ mb: 3 }} />
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} variant="rectangular" height={44} sx={{ mb: 3 }} />
          ))}
        </Box>
      </Box>
    ) : kind === 'catalog' ? (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <Box key={index}>
            <Skeleton width="38%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={64} />
          </Box>
        ))}
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
