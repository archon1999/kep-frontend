import { useTranslation } from 'react-i18next';
import { Box, Button, buttonClasses, useTheme } from '@mui/material';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import SettingsIcon from 'shared/components/icons/SettingsIcon';

const SettingPanelToggler = () => {
  const {
    settingsPanelConfig: { openSettingPanel, showSettingPanelButton },
    setSettingsPanelConfig,
  } = useSettingsPanelContext();
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'fixed',
        display: { xs: 'none', sm: openSettingPanel || !showSettingPanelButton ? 'none' : 'block' },
        zIndex: theme.zIndex.drawer + 1,
        top: '50%',
        right: 0,
        width: 'max-content',
        transform: 'rotate(-90deg) translate(50%, -100%)',
        transformOrigin: 'top right',
      }}
    >
      <Button
        size="medium"
        color="neutral"
        variant="soft"
        sx={[
          {
            border: 1,
            fontSize: 13,
            borderColor: 'divider',
            borderRadius: 0,
            borderBottomColor: 'transparent',
            textTransform: 'uppercase',
            px: 1.25,
            py: 0.5,
            [`& .${buttonClasses.icon}`]: {
              marginRight: 0.5,
            },
          },
        ]}
        startIcon={
          <SettingsIcon
            sx={{
              color: 'primary.main',
              animation: `spin 5s linear infinite`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          />
        }
        onClick={() =>
          setSettingsPanelConfig({
            openSettingPanel: true,
          })
        }
        aria-label={t('settings.customizer.toggle')}
        title={t('settings.customizer.toggle')}
      >
        {t('settings.customizer.toggle')}
      </Button>
    </Box>
  );
};

export default SettingPanelToggler;
