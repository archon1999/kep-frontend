import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useThemeMode } from 'shared/hooks/useThemeMode';

const ThemeModeToggleTab = () => {
  const { t } = useTranslation();
  const { mode, setThemeMode } = useThemeMode();
  return (
    <Tabs
      value={mode ?? 'system'}
      onChange={(_, value) => setThemeMode(value)}
      variant="fullWidth"
      aria-label={t('settings.customizer.sections.theme')}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', '& .MuiTabs-list': { gap: 0 } }}
    >
      {(
        [
          ['light', 'material-symbols:light-mode-outline-rounded'],
          ['dark', 'material-symbols-light:dark-mode-outline-rounded'],
          ['system', 'material-symbols:monitor-outline-rounded'],
        ] as const
      ).map(([value, icon]) => (
        <Tab
          key={value}
          value={value}
          label={t(`settings.customizer.labels.${value}`)}
          icon={<IconifyIcon icon={icon} fontSize={18} />}
          iconPosition="start"
          sx={{ px: 0.5, fontSize: 12 }}
        />
      ))}
    </Tabs>
  );
};
export default ThemeModeToggleTab;
