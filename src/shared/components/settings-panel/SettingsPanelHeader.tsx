import { useTranslation } from 'react-i18next';
import { IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';

export type SettingsPanelTab = 'theme' | 'font' | 'layout';

export const SettingsPanelHeader = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ px: 3, py: 2, flexShrink: 0 }}>
      <Typography
        component="h2"
        variant="h5"
        id="settings-panel-title"
        sx={{ flex: 1, minWidth: 0 }}
      >
        <MixedText>{t('settings.customizer.title')}</MixedText>
      </Typography>
      <PatternArtwork
        kind="settings"
        sx={{ width: 88, '& .kep-pattern-signal': { animation: 'none' } }}
      />
      <IconButton aria-label={t('common.close')} onClick={onClose} size="small">
        <IconifyIcon icon="material-symbols:close-rounded" />
      </IconButton>
    </Stack>
  );
};

export const SettingsPanelTabs = ({
  value,
  onChange,
}: {
  value: SettingsPanelTab;
  onChange: (value: SettingsPanelTab) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Tabs
      value={value}
      onChange={(_, tab: SettingsPanelTab) => onChange(tab)}
      variant="fullWidth"
      aria-label={t('settings.customizer.title')}
      sx={{
        px: 2,
        borderBlock: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
        '& .MuiTabs-list': { gap: 0 },
      }}
    >
      {(['theme', 'font', 'layout'] as const).map((tab) => (
        <Tab
          key={tab}
          value={tab}
          label={t(`settings.customizer.sections.${tab}`)}
          id={`customize-tab-${tab}`}
          aria-controls={`customize-panel-${tab}`}
        />
      ))}
    </Tabs>
  );
};
