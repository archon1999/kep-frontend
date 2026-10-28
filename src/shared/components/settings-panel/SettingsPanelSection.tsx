import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

const SettingsPanelSection = ({
  title,
  disable,
  children,
}: PropsWithChildren<{ title: string; disable?: boolean }>) => {
  const { t } = useTranslation();
  return (
    <Box
      component="fieldset"
      disabled={disable}
      sx={{
        m: 0,
        p: 3,
        minWidth: 0,
        border: 0,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Typography
        component="legend"
        variant="overline"
        sx={{
          float: 'left',
          width: 1,
          mb: 2,
          p: 0,
          color: disable ? 'text.disabled' : 'text.secondary',
        }}
      >
        {title}
      </Typography>
      {disable && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {t('settings.customizer.notAvailableInLayout')}
        </Typography>
      )}
      <Box sx={{ clear: 'both', ...(disable && { opacity: 0.4, pointerEvents: 'none' }) }}>
        {children}
      </Box>
    </Box>
  );
};

export default SettingsPanelSection;
