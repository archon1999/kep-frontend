import { Fragment } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import sitemap from 'app/routes/sitemap';
import { sidenavVibrantStyle } from 'app/theme/styles/vibrantNav';
import Logo from 'shared/components/common/Logo';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import { useNavContext } from '../NavProvider';
import SidenavSimpleBar from './SidenavSimpleBar';
import SlimNavItem from './SlimNavItem';

const SlimSidenav = () => {
  const {
    config: { sidenavCollapsed, drawerWidth, navColor, navigationMenuType },
  } = useSettingsContext();
  const { sidenavAppbarVariant } = useNavContext();

  const drawer = (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {navColor === 'vibrant' && <VibrantBackground position="side" />}
        <Toolbar
          variant={sidenavAppbarVariant}
          sx={[
            {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {navigationMenuType === 'sidenav' && <Logo showName={false} />}
        </Toolbar>
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <SidenavSimpleBar
            sx={{
              height: 1,
              '& .simplebar-horizontal': {
                display: 'none',
              },
            }}
            autoHide={false}
          >
            <Box
              sx={{
                p: 2,
              }}
            >
              <List
                component="nav"
                sx={{
                  py: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {sitemap.map((item, index) => (
                  <Fragment key={item.pathName}>
                    <SlimNavItem item={item} level={0} />
                    {index !== sitemap.length - 1 && <Divider sx={{ my: 1.5 }} />}
                  </Fragment>
                ))}
              </List>
            </Box>
          </SidenavSimpleBar>
        </Box>
      </Box>
    </>
  );

  const theme = useTheme();

  return (
    <Box
      component="nav"
      className="slim-sidenav"
      sx={[
        {
          width: { md: drawerWidth },
          flexShrink: { sm: 0 },
        },
        !sidenavCollapsed && {
          transition: {
            xs: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
            }),
          },
        },
        navColor === 'vibrant' && sidenavVibrantStyle,
      ]}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          [`& .${drawerClasses.paper}`]: {
            boxSizing: 'border-box',
            width: drawerWidth,
            transition: {
              xs: theme.transitions.create(['width'], {
                duration: theme.transitions.duration.standard,
              }),
            },
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SlimSidenav;
