import { Box, Divider, Stack, paperClasses } from '@mui/material';
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
import { SearchBoxButton } from '../common/search-box/SearchBox';
import TopnavItems from './TopnavItems';

const Topnav = () => {
  const {
    config: { navColor },
    handleDrawerToggle,
  } = useSettingsContext();

  const { up, down } = useBreakpoints();
  const upSm = up('sm');
  const upLg = up('lg');
  const downSm = down('sm');

  return (
    <MuiAppBar
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
      <Toolbar variant="appbar" sx={{ px: { xs: 3, md: 5, position: 'relative' } }}>
        <Box
          sx={{
            display: { xs: 'flex' },
            alignItems: 'center',
            gap: 1,
            pr: { lg: 2 },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: 'flex', lg: 'none' },
            }}
          >
            <IconifyIcon icon="material-symbols:menu-rounded" sx={{ fontSize: 20 }} />
          </IconButton>

          {upSm && <Logo />}
        </Box>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flex: 1,
          }}
        >
          {upLg && <TopnavItems />}
          <AppbarActionItems
            showThemeToggler={!downSm}
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
