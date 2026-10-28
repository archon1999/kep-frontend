import { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@mui/material';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { overlayPaperStyles } from 'app/theme/styles/overlays';
import {
  SettingsPanelHeader,
  type SettingsPanelTab,
  SettingsPanelTabs,
} from './SettingsPanelHeader';
import SettingsPanelSkeleton from './SettingsPanelSkeleton';

const SettingsPanelContent = lazy(() => import('./SettingsPanelContent'));

const SettingsPanel = () => {
  const { t } = useTranslation();
  const {
    settingsPanelConfig: { openSettingPanel },
    setSettingsPanelConfig,
  } = useSettingsPanelContext();
  const [hasOpened, setHasOpened] = useState(openSettingPanel);
  const [tab, setTab] = useState<SettingsPanelTab>('theme');
  useEffect(() => {
    if (openSettingPanel) setHasOpened(true);
  }, [openSettingPanel]);
  const handleClose = () => setSettingsPanelConfig({ openSettingPanel: false });

  return (
    <Drawer
      open={openSettingPanel}
      anchor="right"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={(theme) => ({ zIndex: theme.zIndex.tooltip + 1 })}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-label': t('settings.customizer.title'),
          sx: (theme) => ({
            ...overlayPaperStyles(theme),
            width: 400,
            maxWidth: '100vw',
            display: 'flex',
            overflow: 'hidden',
          }),
        },
      }}
    >
      {(openSettingPanel || hasOpened) && (
        <>
          <SettingsPanelHeader onClose={handleClose} />
          <SettingsPanelTabs value={tab} onChange={setTab} />
          <Suspense fallback={<SettingsPanelSkeleton tab={tab} />}>
            <SettingsPanelContent tab={tab} />
          </Suspense>
        </>
      )}
    </Drawer>
  );
};

export default SettingsPanel;
