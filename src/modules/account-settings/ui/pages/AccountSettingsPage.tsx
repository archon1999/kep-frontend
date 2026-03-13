import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContext } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Divider,
  Drawer,
  Paper,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import SimpleBar from 'shared/components/base/SimpleBar.tsx';
import AccountTabPanel from '../components/AccountTabPanel';
import CareerSection from '../components/CareerSection';
import GeneralSettingsForm from '../components/GeneralSettingsForm';
import PasswordForm from '../components/PasswordForm';
import ProfileInformationForm from '../components/ProfileInformationForm';
import SideTabList from '../components/SideTabList';
import SkillsForm from '../components/SkillsForm';
import SocialLinksForm from '../components/SocialLinksForm';
import SystemSettingsPanel from '../components/SystemSettingsPanel';
import TeamsSection from '../components/TeamsSection';
import TechnologiesForm from '../components/TechnologiesForm';
import { AccountSettingsTab } from '../components/accountSettingsTabs';

const AccountSettingsPage = () => {
  const { t } = useTranslation();
  const { down } = useBreakpoints();
  const theme = useTheme();
  const downMd = down('md');
  const { currentUser } = useAuth();
  const { topbarHeight } = useNavContext();

  const [activeTab, setActiveTab] = useState('general');
  const [showTabList, setShowTabList] = useState(true);

  useEffect(() => {
    if (!downMd) {
      setShowTabList(false);
    } else {
      setShowTabList(true);
    }
  }, [downMd]);

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
          <Stack direction="column" spacing={3}>
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
        value: 'system',
        label: t('settings.system'),
        icon: 'material-symbols:settings-outline',
        panelIcon: 'material-symbols:settings-outline',
        render: <SystemSettingsPanel />,
      },
    ],
    [t],
  );

  const handleTabChange = (_: SyntheticEvent, newValue: string) => setActiveTab(newValue);

  if (!currentUser) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert
          severity="info"
          action={<Button href="/authentication/login">{t('pageTitles.login')}</Button>}
        >
          {t('settings.loginRequired')}
        </Alert>
      </Container>
    );
  }

  return (
    <Paper background={1}>
      <TabContext value={activeTab}>
        <Stack direction={downMd ? 'column' : 'row'} alignItems={downMd ? 'stretch' : 'flex-start'}>
          {downMd ? (
            <Drawer
              hideBackdrop
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={showTabList}
              onClose={() => setShowTabList(false)}
              ModalProps={{
                keepMounted: true,
                disablePortal: true,
              }}
              slotProps={{
                paper: {
                  sx: {
                    bgcolor: 'background.elevation1',
                    width: 1,
                    overflow: 'hidden',
                    pointerEvents: 'auto',
                    height: ({ mixins }) => mixins.contentHeight(topbarHeight),
                    top: ({ mixins }) => mixins.topOffset(topbarHeight, 1),
                  },
                },
              }}
              sx={{
                pointerEvents: 'none',
              }}
            >
              <SimpleBar>
                <SideTabList
                  tabs={tabs}
                  onChange={handleTabChange}
                  onTabClick={() => setShowTabList(false)}
                />
              </SimpleBar>
            </Drawer>
          ) : (
            <Paper
              background={1}
              sx={{
                width: { md: 324, lg: 405 },
                position: 'sticky',
                top: ({ mixins }) => mixins.topOffset(topbarHeight),
                height: ({ mixins }) => mixins.contentHeight(topbarHeight),
              }}
            >
              <SimpleBar>
                <SideTabList tabs={tabs} onChange={handleTabChange} />
              </SimpleBar>
            </Paper>
          )}

          {!downMd ? (
            <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
          ) : null}

          <Paper sx={{ flex: 1, maxWidth: 1 }}>
            <Container
              maxWidth={false}
              sx={{
                px: { xs: 3, md: 5 },
                py: 5,
                maxWidth: { xs: 628, md: 660 },
                overflowY: 'hidden',
                height: downMd ? 1 : 'auto',
              }}
            >
              {tabs.map((tab) => (
                <AccountTabPanel
                  key={tab.id}
                  value={tab.value}
                  title={tab.label}
                  panelIcon={tab.panelIcon}
                  description={tab.description}
                  onOpenTabs={() => setShowTabList(true)}
                >
                  {tab.render}
                </AccountTabPanel>
              ))}
            </Container>
          </Paper>
        </Stack>
      </TabContext>
    </Paper>
  );
};

export default AccountSettingsPage;
