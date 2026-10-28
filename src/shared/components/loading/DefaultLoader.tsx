import { useTranslation } from 'react-i18next';
import { LinearProgress, Stack, Typography } from '@mui/material';
import PatternArtwork from 'shared/components/common/PatternArtwork';

const DefaultLoader = () => {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: 1,
        minHeight: 180,
        width: 1,
      }}
    >
      <PatternArtwork kind="loading" sx={{ width: 210 }} />
      <Typography variant="label" color="text.secondary">
        {t('common.mascot.loading')}
      </Typography>
      <LinearProgress
        aria-label={t('common.mascot.loading')}
        sx={{ width: 112, height: 2, borderRadius: 0, mt: 2 }}
      />
    </Stack>
  );
};

export default DefaultLoader;
