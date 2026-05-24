import { tabClasses, tabsClasses } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import { cssVarRgba } from 'shared/lib/utils';

const ThemeModeToggleTab = () => {
  const { t } = useTranslation();
  const { mode, setThemeMode } = useThemeMode();

  return (
    <ResponsiveTabs
      value={mode ?? 'system'}
      onChange={(value) => setThemeMode(value)}
      ariaLabel="theme mode"
      items={[
        {
          value: 'light',
          label: t('settings.customizer.labels.light'),
          icon: (
            <IconifyIcon icon="material-symbols:light-mode-outline-rounded" fontSize={18} />
          ),
          tabProps: {
            iconPosition: 'start',
            disableRipple: true,
            sx: { px: 1.25 },
          },
        },
        {
          value: 'dark',
          label: t('settings.customizer.labels.dark'),
          icon: (
            <IconifyIcon icon="material-symbols-light:dark-mode-outline-rounded" fontSize={20} />
          ),
          tabProps: {
            iconPosition: 'start',
            disableRipple: true,
            sx: { px: 1.25 },
          },
        },
        {
          value: 'system',
          label: t('settings.customizer.labels.system'),
          icon: <IconifyIcon icon="material-symbols:monitor-outline-rounded" fontSize={18} />,
          tabProps: {
            iconPosition: 'start',
            disableRipple: true,
            sx: { px: 1.25 },
          },
        },
      ]}
      tabsProps={{
        sx: ({ vars, transitions }) => ({
          bgcolor: 'primary.lighter',
          p: 0.5,
          borderRadius: 2,
          [`& .${tabsClasses.list}`]: {
            gap: 0,
          },
          [`& .${tabsClasses.indicator}`]: {
            height: 1,
            bgcolor: cssVarRgba(vars.palette.primary.mainChannel, 0.2),
            borderRadius: 1,
            transition: `${transitions.create('all', {
              duration: transitions.duration.short,
            })} !important`,
          },
          [`& .${tabClasses.root}`]: {
            color: 'text.primary',
            fontWeight: 600,
            [`&.${tabClasses.selected}`]: {
              color: 'primary.dark',
            },
          },
        }),
      }}
    />
  );
};

export default ThemeModeToggleTab;
