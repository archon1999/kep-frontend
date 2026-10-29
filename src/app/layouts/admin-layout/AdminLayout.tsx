import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { Box, Button, Collapse, Drawer, IconButton, Stack, Typography } from '@mui/material';
import NavProvider from 'app/layouts/main-layout/NavProvider';
import LanguageMenu from 'app/layouts/main-layout/common/LanguageMenu';
import ProfileMenu from 'app/layouts/main-layout/common/ProfileMenu';
import ThemeToggler from 'app/layouts/main-layout/common/ThemeToggler';
import { resources } from 'app/routes/resources';
import { adminMenu } from 'app/routes/sitemap';
import { useAdminRegistry } from 'modules/admin/application';
import { resourceTitle } from 'modules/admin/ui/shared/helpers';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';

const groups = ['practice', 'competitions', 'community', 'economy', 'platform', 'system'];
const icons = [
  'mdi:code-tags',
  'mdi:podium',
  'mdi:account-group-outline',
  'mdi:wallet-outline',
  'mdi:tune',
  'mdi:shield-check-outline',
];
const headerHeight = { xs: 64, sm: 64, md: 64, lg: 64, xl: 64 };

export default function AdminLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { data = [] } = useAdminRegistry();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentGroup = data.find((item) => pathname.startsWith(item.path))?.group;
  const [expanded, setExpanded] = useState<string | null>(null);
  const close = () => setMobileOpen(false);
  const navigation = (
    <Stack
      component="nav"
      aria-label={t('admin.console.navigation')}
      sx={{ px: 1.5, py: 2, height: 1, overflowY: 'auto' }}
      spacing={0.5}
    >
      {[
        {
          path: resources.Admin,
          name: t('admin.console.dashboard'),
          icon: 'mdi:view-dashboard-outline',
        },
        {
          path: resources.AdminCatalog,
          name: t('admin.console.catalog'),
          icon: 'mdi:view-grid-outline',
        },
      ].map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          onClick={close}
          color="neutral"
          variant={pathname === item.path ? 'soft' : 'text'}
          startIcon={<IconifyIcon icon={item.icon} />}
          sx={{ justifyContent: 'flex-start', borderRadius: 0.5, py: 1.25 }}
          aria-current={pathname === item.path ? 'page' : undefined}
        >
          {item.name}
        </Button>
      ))}
      <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, pt: 3, pb: 1 }}>
        {t('admin.console.sections')}
      </Typography>
      {groups.map((group, index) => {
        const items = data.filter((item) => item.group === group);
        if (!items.length) return null;
        const open = expanded === group || (expanded === null && currentGroup === group);
        return (
          <Box key={group}>
            <Button
              fullWidth
              color={currentGroup === group ? 'primary' : 'neutral'}
              onClick={() => setExpanded(open ? '' : group)}
              aria-expanded={open}
              startIcon={<IconifyIcon icon={icons[index]} />}
              endIcon={
                <IconifyIcon
                  icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                  sx={{ ml: 'auto' }}
                />
              }
              sx={{ justifyContent: 'flex-start', py: 1.2 }}
            >
              {t(`admin.console.groups.${group}`)}
            </Button>
            <Collapse in={open}>
              <Stack spacing={0.25} sx={{ borderLeft: 1, borderColor: 'divider', ml: 2.5, pl: 1 }}>
                {items.map((item) => (
                  <Button
                    key={item.key}
                    component={Link}
                    to={item.path}
                    onClick={close}
                    variant={pathname.startsWith(item.path) ? 'soft' : 'text'}
                    color={pathname.startsWith(item.path) ? 'primary' : 'neutral'}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 0.8,
                      px: 1.5,
                      borderRadius: 0.5,
                      textAlign: 'left',
                      lineHeight: 1.5,
                    }}
                    aria-current={pathname.startsWith(item.path) ? 'page' : undefined}
                  >
                    {resourceTitle(t, item)}
                  </Button>
                ))}
              </Stack>
            </Collapse>
          </Box>
        );
      })}
      <Box sx={{ flex: 1, minHeight: 24 }} />
      <Button
        component={Link}
        to={resources.Home}
        color="neutral"
        startIcon={<IconifyIcon icon="mdi:arrow-left" />}
        sx={{ justifyContent: 'flex-start' }}
      >
        {t('admin.console.backToSite')}
      </Button>
    </Stack>
  );
  return (
    <NavProvider
      menuItems={adminMenu}
      navLabel={t('admin.title')}
      topbarHeightOverride={headerHeight}
    >
      <Box
        component="header"
        sx={{
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: { xs: 2, md: 3 },
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ display: { md: 'none' } }}
          aria-label={t('admin.console.navigation')}
        >
          <IconifyIcon icon="mdi:menu" />
        </IconButton>
        <Stack
          component={Link}
          to={resources.Admin}
          direction="row"
          gap={1.5}
          alignItems="center"
          sx={{ textDecoration: 'none', color: 'text.primary', mr: { md: 4 } }}
        >
          <IconifyIcon
            icon="mdi:shield-check-outline"
            sx={{ color: 'primary.main', fontSize: 27 }}
          />
          <Typography fontSize={22} fontWeight={650}>
            <MixedText>KEP.uz</MixedText>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              borderLeft: 1,
              borderColor: 'divider',
              pl: 1.5,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {t('admin.title')}
          </Typography>
        </Stack>
        <Box sx={{ flex: 1 }} />
        <Button
          component={Link}
          to={resources.AdminCatalog}
          color="neutral"
          startIcon={<IconifyIcon icon="mdi:magnify" />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {t('admin.console.findSection')}
        </Button>
        <LanguageMenu />
        <ThemeToggler />
        <ProfileMenu type="slim" />
      </Box>
      <Box sx={{ display: 'flex', minWidth: 0 }}>
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 248,
            flexShrink: 0,
            height: 'calc(100dvh - 64px)',
            position: 'sticky',
            top: 64,
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          {navigation}
        </Box>
        <Drawer
          open={mobileOpen}
          onClose={close}
          slotProps={{ paper: { sx: { width: 'min(300px, 88vw)' } } }}
        >
          {navigation}
        </Drawer>
        <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1, minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </NavProvider>
  );
}
