import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';
import { Drawer, drawerClasses } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar, { ToolbarOwnProps } from '@mui/material/Toolbar';
import AppBar from 'app/layouts/main-layout/app-bar';
import Sidenav from 'app/layouts/main-layout/sidenav';
import { useAuth } from 'app/providers/AuthProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { resources } from 'app/routes/resources';
import { MenuItem, clientMenu } from 'app/routes/sitemap';
import { getCanvasFrameStyles } from 'app/theme/styles/surfaceTreatments';
import { sidenavVibrantStyle } from 'app/theme/styles/vibrantNav';
import clsx from 'clsx';
import SimpleBar from 'shared/components/base/SimpleBar';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import { mainDrawerWidth } from 'shared/lib/constants';
import { MainLayoutRoot } from './MainLayout.styles';
import NavProvider from './NavProvider';
import Footer from './footer';
import LandingHeader from './landing/LandingHeader';
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
  const isGameDetail = Boolean(useMatch(`${resources.Games}/:gameId`));
  const isHome = Boolean(useMatch({ path: resources.Home, end: true }));
  const { currentUser, isAuthLoading } = useAuth();
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

  if (isHome && !currentUser && !isAuthLoading) {
    return (
      <>
        <a className="kep-landing-skip" href="#main-content">
          {t('common.accessibility.skipToContent')}
        </a>
        <LandingHeader />
        <main id="main-content" tabIndex={-1} className="kep-landing-main">
          <div className="kep-landing-rails" aria-hidden="true" />
          <SimpleBar autoHide={false}>
            {children}
            <Footer />
          </SimpleBar>
        </main>
      </>
    );
  }

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
          {!isGameDetail && navigationMenuType === 'sidenav' && (
            <>
              <AppBar />
              {sidenavType === 'default' && <Sidenav />}
              {sidenavType === 'slim' && <SlimSidenav />}
            </>
          )}

          {!isGameDetail && navigationMenuType === 'topnav' && (
            <>
              {topnavType === 'default' && <Topnav />}
              {topnavType === 'slim' && <TopnavSlim />}
              {topnavType === 'stacked' && <TopNavStacked />}
            </>
          )}

          {!isGameDetail && (
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
          )}

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
              width: isGameDetail ? '100%' : { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
              display: 'flex',
              flexDirection: 'column',
              ...getCanvasFrameStyles(theme, backgroundPattern),
              ...(!isGameDetail && sidenavType === 'default'
                ? { ml: { md: `${mainDrawerWidth.collapsed}px`, lg: 0 } }
                : {}),
              ...(!isGameDetail && sidenavType === 'slim' ? { ml: { xs: 0 } } : {}),
              ...(!isGameDetail && navigationMenuType === 'topnav' ? { ml: { xs: 0 } } : {}),
            })}
          >
            {!isGameDetail && <Toolbar variant={toolbarVarint} />}

            <Box
              sx={(theme) => ({
                minWidth: 0,
                display: 'flex',
                flex: '1 0 auto',
                flexDirection: 'column',
                minHeight: isGameDetail
                  ? '100vh'
                  : theme.mixins.contentHeight(
                      navigationMenuType === 'topnav'
                        ? theme.mixins.topbar[topnavType]
                        : theme.mixins.topbar.default,
                    ),
              })}
            >
              <Box sx={{ flex: '1 0 auto', minWidth: 0 }}>{children}</Box>
            </Box>
          </Box>
        </NavProvider>
      </Box>
    </Box>
  );
};

const MainLayoutView = (props: PropsWithChildren<MainLayoutProps>) => (
  <MainLayoutRoot>
    <MainLayout {...props} />
  </MainLayoutRoot>
);
export default MainLayoutView;
