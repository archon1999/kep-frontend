import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Toolbar,
  Typography,
  paperClasses,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { alpha } from '@mui/material/styles';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useVisionMode } from 'app/providers/VisionModeProvider';
import { RESET, SET_PRIMARY_COLOR } from 'app/reducers/SettingsReducer';
import { blue, green } from 'app/theme/palette/colors';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import { cssVarRgba } from 'shared/lib/utils';
import NavColorPanel from './NavColorPanel';
import NavigationMenuPanel from './NavigationMenuPanel';
import SidenavShapePanel from './SidenavShapePanel';
import TopnavShapePanel from './TopnavShapePanel';
import VisionModePanel from './VisionModePanel';
import FontSettingsPanel from './font-settings/FontSettingsPanel';
import BackgroundPatternPanel from './surface-settings/BackgroundPatternPanel';
import CardBackgroundPanel from './surface-settings/CardBackgroundPanel';
import CardStylePanel from './surface-settings/CardStylePanel';
import ThemeList from './theme-preset/ThemeList';

const SettingsPanel = () => {
  const { t } = useTranslation();
  const {
    config: { navigationMenuType },
    configDispatch,
  } = useSettingsContext();
  const { resetTheme } = useThemeMode();
  const { isDark } = useResolvedThemeMode();
  const { setMode } = useVisionMode();
  const {
    settingsPanelConfig: {
      openSettingPanel,
      disableNavigationMenuSection,
      disableNavColorSection,
      disableTopShapeSection,
      disableSidenavShapeSection,
    },
    setSettingsPanelConfig,
  } = useSettingsPanelContext();

  const handleReset = () => {
    resetTheme();
    configDispatch({ type: RESET });
    configDispatch({ type: SET_PRIMARY_COLOR, payload: blue[500] });
    setMode('normal');
  };

  return (
    <div>
      <Drawer
        open={openSettingPanel}
        anchor="right"
        onClose={() => {
          setSettingsPanelConfig({ openSettingPanel: false });
        }}
        sx={(theme) => ({
          zIndex: theme.zIndex.tooltip + 1,
          [`& .${paperClasses.root}`]: {
            width: { xs: 'calc(100vw - 24px)', sm: 313 },
            maxWidth: 313,
            backgroundColor: theme.vars.palette.background.menu,
            backgroundImage: isDark
              ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.035)} 0%, transparent 100%)`
              : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)} 0%, transparent 100%)`,
            borderLeft: `1px solid ${alpha(theme.palette.divider, isDark ? 0.36 : 0.72)}`,
          },
        })}
      >
        <Toolbar
          sx={(theme) => ({
            background: `linear-gradient(90.42deg, ${blue[300]} 13.1%, ${green[400]} 143.31%)`,
            gap: 1,

            ...theme.applyStyles('dark', {
              background: `linear-gradient(90.42deg, ${blue[900]} 13.1%, ${green[600]} 143.31%)`,
            }),
          })}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              flex: 1,
            }}
          >
            {t('settings.customizer.title')}
          </Typography>
          <Button
            variant="soft"
            sx={({ vars }) => ({
              bgcolor: cssVarRgba(vars.palette.common.whiteChannel, 0.1),
              color: vars.palette.common.white,
            })}
            startIcon={<IconifyIcon icon="material-symbols:reset-settings-rounded" />}
            onClick={handleReset}
          >
            {t('settings.customizer.reset')}
          </Button>
          <Button
            variant="soft"
            sx={({ vars }) => ({
              bgcolor: cssVarRgba(vars.palette.common.whiteChannel, 0.1),
              color: vars.palette.common.white,
            })}
            shape="square"
            onClick={() => {
              setSettingsPanelConfig({
                openSettingPanel: false,
              });
            }}
          >
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Toolbar>
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <SimpleBar
            sx={{
              height: 1,
              '& .simplebar-mask': {
                zIndex: 'unset',
              },
            }}
            autoHide={false}
          >
            <Box sx={{ p: 3 }}>
              <Stack
                direction="column"
                sx={{
                  gap: 3,
                }}
              >
                <Section title={t('settings.customizer.sections.theme')} isNew>
                  <ThemeList />
                </Section>

                <Divider sx={{ mx: -3 }} />

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

                <Divider sx={{ mx: -3 }} />

                <Section
                  title={t('settings.customizer.sections.navColor')}
                  disable={disableNavColorSection}
                >
                  <Stack sx={{ gap: 2.5 }}>
                    <NavColorPanel />
                    <SubSection title={t('settings.customizer.sections.backgroundPattern')} isNew>
                      <BackgroundPatternPanel />
                    </SubSection>
                    <SubSection title={t('settings.customizer.sections.cardStyle')} isNew>
                      <CardStylePanel />
                    </SubSection>
                    <SubSection title={t('settings.customizer.sections.cardBackground')} isNew>
                      <CardBackgroundPanel />
                    </SubSection>
                  </Stack>
                </Section>

                <Divider sx={{ mx: -3 }} />

                <Section title={t('settings.customizer.sections.font')} isNew>
                  <FontSettingsPanel />
                </Section>

                <Divider sx={{ mx: -3 }} />

                <Section title={t('settings.customizer.sections.visionMode')} isNew>
                  <VisionModePanel />
                </Section>
              </Stack>
            </Box>
          </SimpleBar>
        </Box>
      </Drawer>
    </div>
  );
};

export default SettingsPanel;

const Section = ({
  title,
  disable,
  isNew,
  children,
}: PropsWithChildren<{ title: string; disable?: boolean; isNew?: boolean }>) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={[
        !!disable && {
          pointerEvents: 'none',
          '& .SettingsItem': {
            '&:after': {
              bgcolor: 'unset',
            },
          },
        },
      ]}
    >
      <Stack direction="row" alignItems="center" sx={[{ mb: 2 }, !!disable && { mb: 1 }]}>
        <Typography
          variant="subtitle1"
          sx={[
            {
              fontWeight: 700,
            },
            !!disable && { color: 'text.disabled' },
          ]}
        >
          {title}
        </Typography>
        {isNew && (
          <Chip
            size="xsmall"
            label={t('settings.customizer.new')}
            color="warning"
            sx={{ textTransform: 'capitalize', ml: 1 }}
          />
        )}
      </Stack>
      {disable && (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 2, color: 'info.main' }}>
          <IconifyIcon icon="material-symbols:info-outline" sx={{ fontSize: 16 }} />
          <Typography variant="subtitle2">
            {t('settings.customizer.notAvailableInLayout')}
          </Typography>
        </Stack>
      )}
      <Box sx={[!!disable && { opacity: 0.4 }]}>{children}</Box>
    </Box>
  );
};

const SubSection = ({
  title,
  isNew,
  children,
}: PropsWithChildren<{ title: string; isNew?: boolean }>) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Divider sx={{ mb: 2.5 }} />
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {isNew && (
          <Chip
            size="xsmall"
            label={t('settings.customizer.new')}
            color="warning"
            sx={{ textTransform: 'capitalize', ml: 1 }}
          />
        )}
      </Stack>
      {children}
    </Box>
  );
};
