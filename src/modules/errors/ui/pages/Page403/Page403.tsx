import { useNavigate } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useDocumentNoIndex } from 'app/providers/DocumentTitleProvider';
import { useForbiddenContent } from 'modules/errors/application';
import Logo from 'shared/components/common/Logo';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import StandalonePage from 'shared/components/sections/common/StandalonePage';

const Page403 = () => {
  useDocumentNoIndex();
  const { title, description, ctaHref, ctaLabel } = useForbiddenContent();
  const navigate = useNavigate();
  const handleBack = () => (window.history.length > 1 ? navigate(-1) : navigate(ctaHref));
  return (
    <StandalonePage maxWidth={820}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Logo />
      </Box>
      <Stack
        alignItems="center"
        spacing={2.5}
        sx={{ px: { xs: 3, sm: 6 }, py: { xs: 4, sm: 6 }, textAlign: 'center' }}
      >
        <PatternArtwork kind="error" sx={{ width: 280 }} />
        <Typography
          variant="metric"
          sx={{ fontSize: { xs: 64, sm: 96 }, lineHeight: 1, color: 'primary.main' }}
        >
          403
        </Typography>
        <Typography
          component="h1"
          variant="h3"
          sx={{ fontFamily: 'var(--kep-display-font)', fontWeight: 500 }}
        >
          <MixedText>{title}</MixedText>
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 460, lineHeight: 1.7 }}>
          {description}
        </Typography>
        <Button variant="contained" size="large" onClick={handleBack}>
          {ctaLabel}
        </Button>
      </Stack>
    </StandalonePage>
  );
};
export default Page403;
