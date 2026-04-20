import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import DuelDetailPageHeader from './DuelDetailPageHeader.tsx';
import DuelDetailPageWorkspace from './DuelDetailPageWorkspace.tsx';
import { useDuelDetailPageController } from './DuelDetailPageController.ts';

const DuelDetailPage = () => {
  const { t } = useTranslation();
  const { duel, isInitialLoading, headerProps, workspaceProps } = useDuelDetailPageController();

  if (isInitialLoading) {
    return (
      <Box
        sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!duel || !headerProps || !workspaceProps) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">{t('duels.error')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 1000,
        bgcolor: 'background.elevation1',
      }}
    >
      <DuelDetailPageHeader {...headerProps} />
      <DuelDetailPageWorkspace {...workspaceProps} />
    </Box>
  );
};

export default DuelDetailPage;
