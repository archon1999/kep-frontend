import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNotFoundContent } from 'modules/errors/application';
import Kepper from 'shared/components/common/Kepper';

const Page404 = () => {
  const { title, ctaHref, ctaLabel } = useNotFoundContent();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(ctaHref);
  };

  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        p: { xs: 2.5, sm: 5 },
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="column"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
        spacing={{ xs: 3, md: 4 }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: {
              xs: 300,
              sm: 500,
              md: 720,
              lg: 920,
            },
            maxHeight: {
              xs: '40vh',
              sm: '45vh',
              md: '55vh',
              lg: '60vh',
            },
          }}
        >
          <Stack alignItems="center">
            <Kepper pose="confused" motion="loop" size={220} />
            <Typography variant="h2" color="primary.main">
              404
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ color: 'text.disabled', fontWeight: 'medium', mb: 2 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 'normal', mb: 5 }}>
            {t('common.mascot.notFound')}
          </Typography>

          <Button variant="contained" size="large" sx={{ px: 7 }} onClick={handleBack}>
            {ctaLabel}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Page404;
