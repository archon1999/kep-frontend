import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Dialog, DialogContent, Skeleton } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentInsetSx } from 'app/theme/styles/content';
import { useUserProfilePage } from 'modules/users/application/hooks/useUserProfilePage';
import DialogHeader from 'shared/components/common/DialogHeader';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ProfileHeader from './components/ProfileHeader';
import ProfileOverview from './components/ProfileOverview';
import UserFollowersDialog from './components/user-profile/UserFollowersDialog';
import UserProfileAchievementsTab from './components/user-profile/UserProfileAchievementsTab';
import UserProfileActivityHistoryTab from './components/user-profile/UserProfileActivityHistoryTab';
import UserProfilePrizesTab from './components/user-profile/UserProfilePrizesTab';
import UserProfilePurchasesTab from './components/user-profile/UserProfilePurchasesTab';
import UserProfileRatingsTab from './components/user-profile/UserProfileRatingsTab';

const UserProfilePage = () => {
  const {
    username,
    location,
    navigate,
    user,
    isLoading,
    error,
    mutate,
    ratings,
    ratingsLoading,
    about,
    aboutLoading,
    aboutError,
    reloadAbout,
    social,
    isOwner,
    profilePath,
    tabs,
    activeTab,
  } = useUserProfilePage();

  const { t } = useTranslation();
  const [coverOpen, setCoverOpen] = useState(false);

  return (
    <FramedPage>
      {isLoading || (user && user.username.toLowerCase() !== username.toLowerCase() && !error) ? (
        <Box sx={contentInsetSx}>
          <Skeleton variant="rectangular" height={180} />
          <Skeleton height={80} />
          <Skeleton height={260} />
        </Box>
      ) : error || !user ? (
        <>
          <PageHeader title={username} backTo={resources.Users} />
          <Box sx={contentInsetSx}>
            <Alert
              severity="error"
              action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
            >
              {t('common.loadFailed')}
            </Alert>
          </Box>
        </>
      ) : (
        <>
          <ProfileHeader
            user={user}
            ratings={ratings}
            ratingsLoading={ratingsLoading}
            onPreviewCover={() => setCoverOpen(true)}
          />
          <Box
            component="nav"
            aria-label={t('users.profile.navigation')}
            sx={{
              ...contentInsetSx,
              py: { xs: 1.5, md: 0 },
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <ResponsiveTabs
              value={activeTab}
              onChange={(value) =>
                navigate(`${profilePath}${location.search}#${value}`, {
                  replace: true,
                  preventScrollReset: true,
                })
              }
              items={tabs.map((tab) => ({
                ...tab,
                tabProps: {
                  id: `profile-tab-${tab.value}`,
                  'aria-controls': `profile-panel-${tab.value}`,
                },
              }))}
              ariaLabel={t('users.profile.navigation')}
              tabsProps={{ variant: 'scrollable', scrollButtons: 'auto' }}
            />
          </Box>
          <Box
            role="tabpanel"
            id={`profile-panel-${activeTab}`}
            aria-labelledby={`profile-tab-${activeTab}`}
            sx={{ minHeight: 320 }}
          >
            {activeTab === 'about' &&
              (aboutLoading ? (
                <Box sx={contentInsetSx}>
                  <Skeleton height={160} />
                </Box>
              ) : aboutError ? (
                <Box sx={contentInsetSx}>
                  <Alert
                    severity="error"
                    action={<Button onClick={() => reloadAbout()}>{t('common.retry')}</Button>}
                  >
                    {t('common.loadFailed')}
                  </Alert>
                </Box>
              ) : (
                <ProfileOverview
                  about={about}
                  social={social}
                  username={username}
                  isOwner={isOwner}
                />
              ))}
            {activeTab === 'ratings' && <UserProfileRatingsTab />}
            {activeTab === 'activity-history' && <UserProfileActivityHistoryTab />}
            {activeTab === 'achievements' && <UserProfileAchievementsTab />}
            {activeTab === 'competition-prizes' && <UserProfilePrizesTab />}
            {activeTab === 'purchases' && isOwner && <UserProfilePurchasesTab />}
          </Box>
        </>
      )}
      <Dialog
        open={coverOpen}
        onClose={() => setCoverOpen(false)}
        maxWidth="lg"
        aria-labelledby="profile-cover-title"
      >
        <DialogHeader
          id="profile-cover-title"
          title={t('users.profile.previewCover')}
          onClose={() => setCoverOpen(false)}
        />
        <DialogContent sx={{ '&&': { p: 0 } }}>
          {user?.coverPhoto && (
            <Box
              component="img"
              src={user.coverPhoto}
              alt={username}
              sx={{
                display: 'block',
                maxWidth: 'calc(100vw - 64px)',
                maxHeight: 'calc(100dvh - 160px)',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <UserFollowersDialog
        open={location.pathname.endsWith('/followers')}
        onClose={() =>
          navigate(`${profilePath}${location.hash}`, { replace: true, preventScrollReset: true })
        }
        username={username}
      />
    </FramedPage>
  );
};

export default UserProfilePage;
