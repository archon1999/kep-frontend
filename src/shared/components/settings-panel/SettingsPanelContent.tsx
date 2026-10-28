import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useVisionMode } from 'app/providers/VisionModeProvider';
import { RESET } from 'app/reducers/SettingsReducer';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import NavColorPanel from './NavColorPanel';
import NavigationMenuPanel from './NavigationMenuPanel';
import type { SettingsPanelTab } from './SettingsPanelHeader';
import Section from './SettingsPanelSection';
import SidenavShapePanel from './SidenavShapePanel';
import TopnavShapePanel from './TopnavShapePanel';
import VisionModePanel from './VisionModePanel';
import FontSettingsPanel from './font-settings/FontSettingsPanel';
import BackgroundPatternPanel from './surface-settings/BackgroundPatternPanel';
import CardBackgroundPanel from './surface-settings/CardBackgroundPanel';
import CardStylePanel from './surface-settings/CardStylePanel';
import ThemeList from './theme-preset/ThemeList';

const SettingsPanelContent = ({ tab }: { tab: SettingsPanelTab }) => {
  const { t } = useTranslation();
  const {
    config: { navigationMenuType },
    configDispatch,
  } = useSettingsContext();
  const { resetTheme } = useThemeMode();
  const { setMode } = useVisionMode();
  const {
    settingsPanelConfig: {
      disableNavigationMenuSection,
      disableNavColorSection,
      disableTopShapeSection,
      disableSidenavShapeSection,
    },
  } = useSettingsPanelContext();

  const handleReset = () => {
    resetTheme();
    configDispatch({ type: RESET });
    setMode('normal');
  };

  return (
    <>
      <Box
        key={tab}
        role="tabpanel"
        id={`customize-panel-${tab}`}
        aria-labelledby={`customize-tab-${tab}`}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollbarGutter: 'stable',
        }}
      >
        {tab === 'theme' && (
          <>
            <Section title={t('settings.customizer.sections.theme')}>
              <ThemeList />
            </Section>
            <Section title={t('settings.customizer.sections.backgroundPattern')}>
              <BackgroundPatternPanel />
            </Section>
            <Section title={t('settings.customizer.sections.cardStyle')}>
              <CardStylePanel />
            </Section>
            <Section title={t('settings.customizer.sections.cardBackground')}>
              <CardBackgroundPanel />
            </Section>
          </>
        )}
        {tab === 'font' && (
          <>
            <Section title={t('settings.customizer.sections.font')}>
              <FontSettingsPanel />
            </Section>
            <Section title={t('settings.customizer.sections.visionMode')}>
              <VisionModePanel />
            </Section>
          </>
        )}
        {tab === 'layout' && (
          <>
            <Section
              title={t('settings.customizer.sections.navigationMenu')}
              disable={disableNavigationMenuSection}
            >
              <NavigationMenuPanel />
            </Section>
            {navigationMenuType !== 'topnav' && (
              <Section
                title={t('settings.customizer.sections.sidenavShape')}
                disable={disableSidenavShapeSection}
              >
                <SidenavShapePanel />
              </Section>
            )}
            {navigationMenuType !== 'sidenav' && (
              <Section
                title={t('settings.customizer.sections.topnavShape')}
                disable={disableTopShapeSection}
              >
                <TopnavShapePanel />
              </Section>
            )}
            <Section
              title={t('settings.customizer.sections.navColor')}
              disable={disableNavColorSection}
            >
              <NavColorPanel />
            </Section>
          </>
        )}
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          pb: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <Button
          size="small"
          color="neutral"
          variant="text"
          onClick={handleReset}
          startIcon={<IconifyIcon icon="material-symbols:restart-alt-rounded" />}
        >
          {t('settings.customizer.reset')}
        </Button>
      </Box>
    </>
  );
};
export default SettingsPanelContent;
