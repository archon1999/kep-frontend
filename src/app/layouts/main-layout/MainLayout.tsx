import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, drawerClasses } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar, { ToolbarOwnProps } from '@mui/material/Toolbar';
import AppBar from 'app/layouts/main-layout/app-bar';
import Sidenav from 'app/layouts/main-layout/sidenav';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { MenuItem, clientMenu } from 'app/routes/sitemap';
import { getCanvasFrameStyles } from 'app/theme/styles/surfaceTreatments';
import { sidenavVibrantStyle } from 'app/theme/styles/vibrantNav';
import clsx from 'clsx';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import { mainDrawerWidth } from 'shared/lib/constants';
import NavProvider from './NavProvider';
import Footer from './footer';
import SidenavDrawerContent from './sidenav/SidenavDrawerContent';
import SlimSidenav from './sidenav/SlimSidenav';
import Topnav from './topnav';
import TopNavStacked from './topnav/TopNavStacked';
import TopnavSlim from './topnav/TopnavSlim';

interface MainLayoutProps {
  menuItems?: MenuItem[];
  navLabel?: string;
}

const MainLayout = ({
  children,
  menuItems = clientMenu,
  navLabel,
}: PropsWithChildren<MainLayoutProps>) => {
  const { t } = useTranslation();
  const {
    config: {
      drawerWidth,
      sidenavType,
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

  const toolbarVarint: ToolbarOwnProps['variant'] = useMemo(() => {
    if (navigationMenuType === 'topnav') {
      if (topnavType === 'slim') {
        return 'appbarSlim';
      }
      if (topnavType === 'stacked') {
        return 'appbarStacked';
      }
    }
    return 'appbar';
  }, [navigationMenuType, topnavType]);

  return (
    <Box>
      <Box
        component="a"
        href="#main-content"
        sx={(theme) => ({
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: theme.zIndex.tooltip + 1,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: theme.shadows[4],
          transform: 'translateY(calc(-100% - 16px))',
          transition: theme.transitions.create('transform'),
          '&:focus': {
            transform: 'translateY(0)',
          },
        })}
      >
        {t('common.accessibility.skipToContent')}
      </Box>

      <Box
        className={clsx({
          'nav-vibrant': navColor === 'vibrant',
        })}
        sx={{ display: 'flex', zIndex: 1, position: 'relative' }}
      >
        <NavProvider menuItems={menuItems} navLabel={navLabel}>
          {navigationMenuType === 'sidenav' && (
            <>
              <AppBar />
              {sidenavType === 'default' && <Sidenav />}
              {sidenavType === 'slim' && <SlimSidenav />}
            </>
          )}

          {navigationMenuType === 'topnav' && (
            <>
              {topnavType === 'default' && <Topnav />}
              {topnavType === 'slim' && <TopnavSlim />}
              {topnavType === 'stacked' && <TopNavStacked />}
            </>
          )}

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
                  width: { xs: 'min(300px, calc(100vw - 24px))', sm: mainDrawerWidth.full },
                },
              },
              navigationMenuType === 'topnav' && {
                display: { md: 'block', lg: 'none' },
              },
              navColor === 'vibrant' && sidenavVibrantStyle,
            ]}
          >
            {navColor === 'vibrant' && <VibrantBackground position="side" />}
            <SidenavDrawerContent variant="temporary" />
          </Drawer>

          <Box
            component="main"
            id="main-content"
            tabIndex={-1}
            sx={(theme) => ({
              flexGrow: 1,
              minWidth: 0,
              p: 0,
              minHeight: '100vh',
              overflow: 'visible',
              width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
              display: 'flex',
              flexDirection: 'column',
              ...getCanvasFrameStyles(theme, backgroundPattern),
              ...(sidenavType === 'default'
                ? { ml: { md: `${mainDrawerWidth.collapsed}px`, lg: 0 } }
                : {}),
              ...(sidenavType === 'slim' ? { ml: { xs: 0 } } : {}),
              ...(navigationMenuType === 'topnav' ? { ml: { xs: 0 } } : {}),
            })}
          >
            <Toolbar variant={toolbarVarint} />

            <Box
              sx={(theme) => ({
                minWidth: 0,
                display: 'flex',
                flex: '1 0 auto',
                flexDirection: 'column',
                minHeight: theme.mixins.contentHeight(
                  navigationMenuType === 'topnav'
                    ? theme.mixins.topbar[topnavType]
                    : theme.mixins.topbar.default,
                ),
              })}
            >
              <Box sx={{ flex: '1 0 auto', minWidth: 0 }}>{children}</Box>
              <Footer />
            </Box>
          </Box>
        </NavProvider>
      </Box>
    </Box>
  );
};

export default MainLayout;
