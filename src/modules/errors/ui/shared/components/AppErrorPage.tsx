import { Alert, Box, Button, Stack, Typography, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStaleClientContent, useUnexpectedErrorContent } from 'modules/errors/application';
import type { AppErrorKind } from '../utils/app-error';

interface AppErrorPageProps {
  kind: AppErrorKind;
}

const AppErrorPage = ({ kind }: AppErrorPageProps) => {
  const { t } = useTranslation();
  const staleClientContent = useStaleClientContent();
  const unexpectedContent = useUnexpectedErrorContent();
  const content = kind === 'stale-client' ? staleClientContent : unexpectedContent;
  const isStaleClient = kind === 'stale-client';

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.assign('/');
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 6 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
          theme.palette.background.default,
          0.96,
        )} 55%, ${alpha(theme.palette.warning.main, isStaleClient ? 0.1 : 0.05)} 100%)`,
      })}
    >
      <Stack
        spacing={4}
        sx={(theme) => ({
          width: '100%',
          maxWidth: 720,
          p: { xs: 3, sm: 5 },
          borderRadius: 6,
          bgcolor: alpha(theme.palette.background.paper, 0.92),
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.18)}`,
          backdropFilter: 'blur(16px)',
        })}
      >
        <Stack spacing={1.5}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              letterSpacing: 1.6,
              color: isStaleClient ? 'warning.main' : 'error.main',
            }}
          >
            {isStaleClient
              ? t('errors.staleClientLabel', { defaultValue: 'Yangi versiya mavjud' })
              : t('errors.unexpectedLabel', { defaultValue: 'Frontend xatoligi' })}
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            {content.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
            {content.description}
          </Typography>
        </Stack>

        <Alert severity={isStaleClient ? 'warning' : 'error'} variant="outlined">
          {isStaleClient
            ? t('errors.staleClientHint', {
                defaultValue: "Update olish uchun sahifani qayta yuklang.",
              })
            : t('errors.unexpectedHint', {
                defaultValue: "Xatolik tafsilotlari konsolda saqlanadi.",
              })}
        </Alert>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button size="large" variant="contained" onClick={handleReload}>
            {content.ctaLabel}
          </Button>
          {!isStaleClient && (
            <Button size="large" variant="outlined" onClick={handleGoHome}>
              {t('errors.goHome', { defaultValue: "Bosh sahifaga o'tish" })}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default AppErrorPage;
