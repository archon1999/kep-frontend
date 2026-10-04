import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';

const TestPassSkeleton = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { topbarHeight } = useNavContext();

  return (
    <Paper
      elevation={0}
      variant="elevation"
      sx={{ minHeight: '100%', borderRadius: 0, border: 0, bgcolor: 'background.paper' }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          pb: { xs: 'calc(88px + env(safe-area-inset-bottom))', md: 5 },
        }}
        role="status"
        aria-label={t('tests.loading')}
      >
        <Stack spacing={{ xs: 2, md: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{
              pb: { xs: 0, md: 3 },
              borderBottom: { xs: 0, md: '1px solid' },
              borderColor: 'divider',
            }}
          >
            <Stack spacing={0.75} sx={{ width: { xs: '100%', sm: '60%' } }}>
              <Skeleton width={140} height={20} />
              <Skeleton width="90%" height={isMobile ? 28 : 34} />
            </Stack>
            {!isMobile && (
              <Skeleton variant="rounded" width={156} height={66} sx={{ borderRadius: 2 }} />
            )}
          </Stack>
          {isMobile && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              sx={{
                position: 'sticky',
                top: topbarHeight ?? theme.mixins.topbar.default,
                zIndex: theme.zIndex.appBar - 1,
                py: 1,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton variant="rounded" width={144} height={44} />
              <Skeleton width={96} height={20} />
            </Stack>
          )}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 3, md: 2, lg: 3 }}
            alignItems="flex-start"
          >
            <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
              <Stack
                direction="row"
                justifyContent={isMobile ? 'flex-end' : 'space-between'}
                gap={1}
              >
                {!isMobile && <Skeleton variant="rounded" width={96} height={24} />}
                <Skeleton variant="rounded" width={128} height={24} />
              </Stack>
              <Stack spacing={1}>
                <Skeleton width="90%" height={24} />
                <Skeleton width="55%" height={24} />
              </Stack>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ px: 2, py: 1.25, bgcolor: 'background.elevation1' }}
                >
                  <Skeleton variant="rounded" width={18} height={18} />
                  <Skeleton width={72} height={18} />
                </Stack>
                <Divider />
                <Box sx={{ height: 220, px: 2, py: 1.5 }}>
                  <Skeleton width="45%" height={20} />
                  <Skeleton width="30%" height={20} />
                </Box>
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1.5}
                sx={
                  isMobile
                    ? {
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        px: 2,
                        pt: 1,
                        pb: 'max(8px, env(safe-area-inset-bottom))',
                        zIndex: theme.zIndex.appBar + 1,
                        bgcolor: 'background.paper',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }
                    : { pt: 1 }
                }
              >
                <Skeleton
                  variant="rounded"
                  height={isMobile ? 44 : 38}
                  sx={isMobile ? { width: 44, flexShrink: 0 } : { width: 100 }}
                />
                <Skeleton
                  variant="rounded"
                  height={isMobile ? 44 : 38}
                  sx={isMobile ? { flex: 1 } : { width: 184, maxWidth: '100%' }}
                />
              </Stack>
            </Stack>
            {!isMobile && (
              <Box sx={{ width: { md: 280, lg: 328 }, flexShrink: 0 }}>
                <Stack
                  spacing={2.5}
                  sx={{ p: 2.5, bgcolor: 'background.elevation1', borderRadius: 4 }}
                >
                  <Stack spacing={1.25}>
                    <Skeleton width="45%" height={24} />
                    <Skeleton width="90%" height={20} />
                    <Skeleton variant="rounded" width="100%" height={4} />
                  </Stack>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(5, minmax(0, 1fr))',
                        sm: 'repeat(6, minmax(0, 1fr))',
                        md: 'repeat(5, minmax(0, 1fr))',
                        lg: 'repeat(6, minmax(0, 1fr))',
                      },
                      gap: 1,
                    }}
                  >
                    {Array.from({ length: 12 }, (_, index) => (
                      <Skeleton
                        key={index}
                        variant="rounded"
                        height={40}
                        sx={{ borderRadius: 1.25 }}
                      />
                    ))}
                  </Box>
                  <Skeleton width="90%" height={16} />
                  <Divider />
                  <Skeleton variant="rounded" width="100%" height={38} />
                </Stack>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </Paper>
  );
};

export default TestPassSkeleton;
