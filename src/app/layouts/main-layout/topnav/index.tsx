import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack, paperClasses, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { topnavVibrantStyle } from 'app/theme/styles/vibrantNav';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import AppbarActionItems from '../common/AppbarActionItems';
import NavLogoLabel from '../common/NavLogoLabel';
import { SearchBoxButton } from '../common/search-box/SearchBox';
import TopnavItems from './TopnavItems';

const Topnav = () => {
  const { t } = useTranslation();
  const {
    config: { navColor },
    handleDrawerToggle,
  } = useSettingsContext();

  const { up } = useBreakpoints();
  const upSm = up('sm');
  const upMd = up('md');
  const upLg = up('lg');
  const wideDesktopNav = useMediaQuery('(min-width: 1280px)');
  const showDesktopNav = upLg && wideDesktopNav;

  return (
    <MuiAppBar
      className="kep-topnav"
      position="fixed"
      sx={[
        {
          width: 1,
          [`&.${paperClasses.root}`]: {
            outline: 'none',
          },
        },
        navColor === 'vibrant' && topnavVibrantStyle,
      ]}
    >
      {navColor === 'vibrant' && <VibrantBackground position="top" />}
      <Toolbar
        className="kep-topnav-inner"
        variant="appbar"
        sx={{ px: { xs: 2, sm: 3, md: 5 }, position: 'relative' }}
      >
        <Box
          sx={{
            display: { xs: 'flex' },
            alignItems: 'center',
            gap: 1,
            '@media (max-width: 380px)': { gap: 0.5 },
            pr: { lg: 2 },
          }}
        >
          <IconButton
            color="inherit"
            aria-label={t('homePage.landing.footer.menu')}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: showDesktopNav ? 'none' : 'flex',
            }}
          >
            <IconifyIcon icon="material-symbols:menu-rounded" sx={{ fontSize: 20 }} />
          </IconButton>

          {
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Logo
                showName={upSm}
                sx={{ '@media (max-width: 380px)': { width: 26, height: 26 } }}
              />
              {upMd && <NavLogoLabel />}
            </Box>
          }
        </Box>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
          }}
        >
          {showDesktopNav && <TopnavItems />}
          <AppbarActionItems
            showThemeToggler
            searchComponent={
              upSm ? (
                <Box sx={{ pr: 1.5 }}>
                  <SearchBoxButton variant="soft" color="neutral" />
                </Box>
              ) : undefined
            }
          />
        </Stack>
      </Toolbar>
      <Divider />
    </MuiAppBar>
  );
};

export default Topnav;
