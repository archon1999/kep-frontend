import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContext, TabPanel } from '@mui/lab';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useAccountSettingsPage } from 'modules/account-settings/application/hooks/useAccountSettingsPage';
import {
  AccountSettingsTab,
  AccountSettingsTabValue,
  accountSettingsTabRoutes,
  getAccountSettingsTabValue,
} from 'modules/account-settings/ui/shared';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import {
  CareerSection,
  GeneralSettingsForm,
  NotificationsSettingsPanel,
  PasswordForm,
  ProfileInformationForm,
  SideTabList,
  SkillsForm,
  SocialLinksForm,
  SystemSettingsPanel,
  TeamsSection,
  TechnologiesForm,
} from '../../shared/components';

const AccountSettingsPage = () => {
  const { currentUser, location, navigate } = useAccountSettingsPage();

  const { t } = useTranslation();
  const activeTab = getAccountSettingsTabValue(location.pathname);
  const tabs: AccountSettingsTab[] = useMemo(
    () => [
      {
        id: 1,
        value: 'general',
        label: t('settings.general'),
        icon: 'material-symbols:person-outline',
        panelIcon: 'material-symbols:person-outline',
        render: <GeneralSettingsForm />,
      },
      {
        id: 2,
        value: 'password',
        label: t('settings.changePassword'),
        icon: 'material-symbols:lock-outline',
        panelIcon: 'material-symbols:lock-outline',
        render: <PasswordForm />,
      },
      {
        id: 3,
        value: 'information',
        label: t('settings.information'),
        icon: 'material-symbols:info-outline',
        panelIcon: 'material-symbols:info-outline',
        render: <ProfileInformationForm />,
      },
      {
        id: 4,
        value: 'social',
        label: t('settings.social'),
        icon: 'material-symbols:link',
        panelIcon: 'material-symbols:link',
        render: <SocialLinksForm />,
      },
      {
        id: 5,
        value: 'skills',
        label: t('settings.skills'),
        icon: 'material-symbols:trending-up',
        panelIcon: 'material-symbols:trending-up',
        render: (
          <Stack direction="column" spacing={0}>
            <SkillsForm />
            <TechnologiesForm />
          </Stack>
        ),
      },
      {
        id: 6,
        value: 'career',
        label: t('settings.career'),
        icon: 'material-symbols:trending-up',
        panelIcon: 'material-symbols:trending-up',
        render: <CareerSection />,
      },
      {
        id: 7,
        value: 'teams',
        label: t('settings.teams'),
        icon: 'material-symbols:group-outline',
        panelIcon: 'material-symbols:group-outline',
        render: <TeamsSection />,
      },
      {
        id: 8,
        value: 'notifications',
        label: t('notifications.title'),
        icon: 'material-symbols:notifications-outline',
        panelIcon: 'material-symbols:notifications-outline',
        render: <NotificationsSettingsPanel />,
      },
      {
        id: 9,
        value: 'system',
        label: t('settings.system'),
        icon: 'material-symbols:settings-outline',
        panelIcon: 'material-symbols:settings-outline',
        render: <SystemSettingsPanel />,
      },
    ],
    [t],
  );

  const changeTab = (value: string) => {
    const route = accountSettingsTabRoutes[value as AccountSettingsTabValue];
    if (route && location.pathname !== route) navigate(route, { preventScrollReset: true });
  };

  return (
    <FramedPage>
      <PageHeader
        title={t('pageTitles.accountSettings')}
        subtitle={t('settings.pageSubtitle')}
        variant="detail"
        backTo={
          currentUser
            ? getResourceByUsername(resources.UserProfile, currentUser.username)
            : undefined
        }
        backLabel={t('common.backTo', { destination: t('users.profile.identity') })}
      />
      <TabContext value={activeTab}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '244px minmax(0, 1fr)' },
            minHeight: { md: 640 },
          }}
        >
          <Box
            component="aside"
            sx={{
              minWidth: 0,
              borderRightWidth: { xs: 0, md: 1 },
              borderRightStyle: 'solid',
              borderBottomWidth: { xs: 1, md: 0 },
              borderBottomStyle: 'solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              sx={{
                p: 3,
                borderBottom: 1,
                borderColor: 'divider',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.username}
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="label" color="text.secondary">
                  {t('settings.account')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>
                  @{currentUser?.username}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <SideTabList tabs={tabs} onChange={(_, value) => changeTab(value)} />
            </Box>
            <Box
              sx={{ display: { xs: 'block', md: 'none' }, px: 'var(--kep-content-inset)', py: 2 }}
            >
              <ResponsiveTabs
                mobileBreakpoint="md"
                value={activeTab}
                onChange={changeTab}
                items={tabs.map(({ value, label }) => ({ value, label }))}
                ariaLabel={t('settings.navigation')}
              />
            </Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            {tabs.map((tab) => (
              <TabPanel key={tab.value} value={tab.value} sx={{ p: 0 }}>
                {tab.render}
              </TabPanel>
            ))}
          </Box>
        </Box>
      </TabContext>
    </FramedPage>
  );
};

export default AccountSettingsPage;
