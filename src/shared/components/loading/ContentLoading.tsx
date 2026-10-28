import { useTranslation } from 'react-i18next';
import { CircularProgress, Stack } from '@mui/material';

const ContentLoading = () => {
  const { t } = useTranslation();
  return (
    <Stack role="status" aria-label={t('common.loading')} alignItems="center" sx={{ p: 4 }}>
      <CircularProgress size={24} aria-hidden="true" />
    </Stack>
  );
};

export default ContentLoading;
