import { PropsWithChildren, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import Logo from 'shared/components/common/Logo';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import DefaultLoader from 'shared/components/loading/DefaultLoader';
import StandalonePage from 'shared/components/sections/common/StandalonePage';

const DefaultAuthLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  return (
    <StandalonePage>
      <Box
        component="header"
        sx={{ p: { xs: 2.5, md: 3.5 }, borderBottom: 1, borderColor: 'divider' }}
      >
        <Logo />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
        }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{
            p: 5,
            display: { xs: 'none', md: 'flex' },
            borderRight: '1px solid var(--kep-line)',
            backgroundImage: 'radial-gradient(var(--kep-line) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          <PatternArtwork kind="auth" sx={{ width: 360 }} />
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'var(--kep-display-font)',
              fontWeight: 500,
              maxWidth: 340,
              textAlign: 'center',
              textWrap: 'balance',
            }}
          >
            <MixedText>{t('auth.platformTitle')}</MixedText>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 320, textAlign: 'center', lineHeight: 1.7 }}
          >
            {t('auth.platformDescription')}
          </Typography>
        </Stack>
        <Box sx={{ minWidth: 0, py: { xs: 1, md: 3 } }}>
          <Suspense fallback={<DefaultLoader />}>{children}</Suspense>
        </Box>
      </Box>
    </StandalonePage>
  );
};
export default DefaultAuthLayout;
