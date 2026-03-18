import { PropsWithChildren } from 'react';
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
import { useVisionMode } from 'app/providers/VisionModeProvider';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { RESET, SET_PRIMARY_COLOR } from 'app/reducers/SettingsReducer';
import { blue, green } from 'app/theme/palette/colors';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import { cssVarRgba } from 'shared/lib/utils';
import NavColorPanel from './NavColorPanel';
import NavigationMenuPanel from './NavigationMenuPanel';
import SidenavShapePanel from './SidenavShapePanel';
import TopnavShapePanel from './TopnavShapePanel';
import VisionModePanel from './VisionModePanel';
import FontSettingsPanel from './font-settings/FontSettingsPanel';
import ThemeList from './theme-preset/ThemeList';

const SettingsPanel = () => {
  const {
    config: { navigationMenuType },
    configDispatch,
  } = useSettingsContext();
  const { resetTheme } = useThemeMode();
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
        sx={({ zIndex }) => ({
          zIndex: zIndex.tooltip + 1,
          [`& .${paperClasses.root}`]: {
            width: 313,
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
            Customize
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
            Reset
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
                <Section title="Theme" isNew>
                  <ThemeList />
                </Section>

                <Divider sx={{ mx: -3 }} />

                <Section title="Navigation Menu" disable={disableNavigationMenuSection}>
                  <NavigationMenuPanel />
                </Section>

                {navigationMenuType !== 'topnav' && (
                  <Section title="Sidenav Shape" disable={disableSidenavShapeSection}>
                    <SidenavShapePanel />
                  </Section>
                )}
                {navigationMenuType !== 'sidenav' && (
                  <Section title="Topnav Shape" disable={disableTopShapeSection}>
                    <TopnavShapePanel />
                  </Section>
                )}

                <Divider sx={{ mx: -3 }} />

                <Section title="Nav Color" disable={disableNavColorSection}>
                  <NavColorPanel />
                </Section>

                <Divider sx={{ mx: -3 }} />

                <Section title="Font" isNew>
                  <FontSettingsPanel />
                </Section>

                <Divider sx={{ mx: -3 }} />

                <Section title="Vision Mode" isNew>
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
          <Chip size="xsmall" label="new" color="warning" sx={{ textTransform: 'capitalize', ml: 1 }} />
        )}
      </Stack>
      {disable && (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 2, color: 'info.main' }}>
          <IconifyIcon icon="material-symbols:info-outline" sx={{ fontSize: 16 }} />
          <Typography variant="subtitle2">Not available in this layout.</Typography>
        </Stack>
      )}
      <Box sx={[!!disable && { opacity: 0.4 }]}>{children}</Box>
    </Box>
  );
};
