import { Box, Button, Stack, paperClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { topnavVibrantStyle } from 'app/theme/styles/vibrantNav';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import AppbarActionItems from '../common/AppbarActionItems';
import SearchBox from '../common/search-box/SearchBox';

const AppBar = () => {
  const {
    config: { drawerWidth, navColor },
    handleDrawerToggle,
  } = useSettingsContext();

  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <MuiAppBar
      position="fixed"
      sx={[
        {
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: `1px solid`,
          borderColor: 'divider',
          [`&.${paperClasses.root}`]: {
            outline: 'none',
          },
        },
        navColor === 'vibrant' && !upMd && topnavVibrantStyle,
      ]}
    >
      {navColor === 'vibrant' && !upMd && <VibrantBackground position="top" />}
      <Toolbar variant="appbar" sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 0,
            pr: 0,
          }}
        >
          <Button
            color="neutral"
            variant="soft"
            shape="circle"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <IconifyIcon icon="material-symbols:menu-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Box>

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flex: 1,
          }}
        >
          {upMd && (
            <SearchBox
              sx={{
                width: 1,
                maxWidth: 420,
              }}
            />
          )}
          <AppbarActionItems />
        </Stack>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
