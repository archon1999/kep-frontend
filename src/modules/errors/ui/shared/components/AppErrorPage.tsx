import { useTranslation } from 'react-i18next';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useStaleClientContent, useUnexpectedErrorContent } from 'modules/errors/application';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import StandalonePage from 'shared/components/sections/common/StandalonePage';
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
    <StandalonePage maxWidth={760}>
      <Stack spacing={3} sx={{ p: { xs: 3, sm: 5 } }}>
        <PatternArtwork kind={isStaleClient ? 'loading' : 'error'} sx={{ width: 240 }} />
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
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontFamily: 'var(--kep-display-font)',
              fontWeight: 500,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            <MixedText>{content.title}</MixedText>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
            {content.description}
          </Typography>
        </Stack>

        <Alert severity={isStaleClient ? 'warning' : 'error'} variant="outlined">
          {isStaleClient
            ? t('errors.staleClientHint', {
                defaultValue: 'Update olish uchun sahifani qayta yuklang.',
              })
            : t('errors.unexpectedHint', {
                defaultValue: 'Xatolik tafsilotlari konsolda saqlanadi.',
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
    </StandalonePage>
  );
};

export default AppErrorPage;
