import { PropsWithChildren, useMemo } from 'react';
import { Drawer, drawerClasses } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar, { ToolbarOwnProps } from '@mui/material/Toolbar';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { getCanvasFrameStyles } from 'app/theme/styles/surfaceTreatments';
import { sidenavVibrantStyle } from 'app/theme/styles/vibrantNav';
import clsx from 'clsx';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import useSettingsPanelMountEffect from 'shared/hooks/useSettingsPanelMountEffect';
import { mainDrawerWidth } from 'shared/lib/constants';
// import TopnavSlim from './topnav/TopnavSlim';
// import TopNavStacked from './topnav/TopNavStacked';
import NavProvider from './NavProvider';
import Footer from './footer';
import SidenavDrawerContent from './sidenav/SidenavDrawerContent';
import Topnav from './topnav';

const TopnavLayout = ({ children }: PropsWithChildren) => {
  const {
    config: {
      drawerWidth,
      navigationMenuType,
      topnavType,
      openNavbarDrawer,
      navColor,
      backgroundPattern,
    },
    setConfig,
  } = useSettingsContext();

  const toggleNavbarDrawer = () => {
    setConfig({
      openNavbarDrawer: !openNavbarDrawer,
    });
  };
  useSettingsPanelMountEffect({
    disableNavigationMenuSection: true,
    disableSidenavShapeSection: true,
    disableTopShapeSection: true,
  });

  const toolbarVarint: ToolbarOwnProps['variant'] = useMemo(() => {
    if (topnavType === 'slim') {
      return 'appbarSlim';
    }
    if (topnavType === 'stacked') {
      return 'appbarStacked';
    }
    return 'appbar';
  }, [navigationMenuType, topnavType]);

  return (
    <Box>
      <Box
        className={clsx({
          'nav-vibrant': navColor === 'vibrant',
        })}
        sx={{ display: 'flex', zIndex: 1, position: 'relative' }}
      >
        <NavProvider>
          <Topnav />
          {/* <TopnavSlim /> */}
          {/* <TopNavStacked /> */}
          <Drawer
            variant="temporary"
            open={openNavbarDrawer}
            onClose={toggleNavbarDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            sx={[
              {
                display: { xs: 'block', md: 'none' },
                [`& .${drawerClasses.paper}`]: {
                  pt: 3,
                  boxSizing: 'border-box',
                  width: mainDrawerWidth.full,
                },
              },
              navColor === 'vibrant' && sidenavVibrantStyle,
            ]}
          >
            {navColor === 'vibrant' && <VibrantBackground position="side" />}
            <SidenavDrawerContent variant="temporary" />
          </Drawer>

          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              p: 0,
              height: '100vh',
              overflow: 'auto',
              width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
              display: 'flex',
              flexDirection: 'column',
              ml: { xs: 0 },
              ...getCanvasFrameStyles(theme, backgroundPattern),
            })}
          >
            <Toolbar variant={toolbarVarint} />

            <Box
              sx={(theme) => ({
                minHeight: theme.mixins.contentHeight(theme.mixins.topbar[topnavType]),
                display: 'flex',
                flexDirection: 'column',
              })}
            >
              <Box sx={{ flex: '1 0 auto' }}>{children}</Box>
              <Footer />
            </Box>
          </Box>
        </NavProvider>
      </Box>
    </Box>
  );
};

export default TopnavLayout;
