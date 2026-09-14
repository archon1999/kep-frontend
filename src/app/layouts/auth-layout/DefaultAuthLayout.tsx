import { PropsWithChildren, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Kepper from 'shared/components/common/Kepper';
import Logo from 'shared/components/common/Logo';
import DefaultLoader from 'shared/components/loading/DefaultLoader';

const DefaultAuthLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      sx={{
        height: { md: '100vh' },
        minHeight: '100vh',
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
      }}
    >
      <Grid
        sx={{
          borderRight: { md: 1 },
          borderColor: { md: 'divider' },
        }}
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Stack
          direction="column"
          sx={{
            justifyContent: 'space-between',
            height: 1,
            p: { xs: 3, sm: 5 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Logo />
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              py: { xs: 2, md: 6 },
            }}
          >
            <Stack sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Kepper pose="welcome" motion="loop" size={300} />
            </Stack>
            <Stack sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Kepper pose="welcome" size={80} />
            </Stack>
            <Typography variant="h4" sx={{ mt: 2 }}>
              {t('common.mascot.name')}
            </Typography>
            <Typography color="text.secondary" textAlign="center" sx={{ mt: 1, maxWidth: 320 }}>
              {t('common.mascot.companion')}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid
        size={{
          md: 6,
          xs: 12,
        }}
        sx={{
          display: { xs: 'block', md: 'block' },
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Suspense fallback={<DefaultLoader />}>{children}</Suspense>
      </Grid>
    </Grid>
  );
};

export default DefaultAuthLayout;
