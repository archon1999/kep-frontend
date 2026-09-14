import { useTranslation } from 'react-i18next';
import { LinearProgress, Stack } from '@mui/material';
import Kepper from 'shared/components/common/Kepper';

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
      <Kepper pose="loading" motion="loop" size={112} />
      <LinearProgress
        aria-label={t('common.mascot.loading')}
        sx={{ width: 100, height: 3, borderRadius: 2, mt: 1 }}
      />
    </Stack>
  );
};

export default DefaultLoader;
