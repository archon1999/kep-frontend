import { Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import HomeProfileSection from '../components/HomeProfileSection.tsx';
import BirthdaysSection from '../components/BirthdaysSection';
import StatisticsSection from '../components/StatisticsSection.tsx';
import UserActivitySection from '../components/UserActivitySection.tsx';
import { useAuth } from 'app/providers/AuthProvider';
import { useUserActivityHistory, useUserRatings } from '../../application/queries';
import NewsSection from '../components/NewsSection.tsx';
import TopUsersSection from '../components/TopUsersSection.tsx';
import PostsSection from '../components/PostsSection.tsx';
import ContestsSection from '../components/ContestsSection.tsx';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const username = currentUser?.username;
  const displayName = currentUser?.firstName?.trim() || username || t('homePage.greeting.defaultName');
  const isAuthenticated = Boolean(currentUser);
  const { data: ratings, isLoading } = useUserRatings(username);
  const {
    data: activityHistory,
    isLoading: isActivityLoading,
    isLoadingMore: isActivityLoadingMore,
    hasMore: hasMoreActivity,
    loadMore: loadMoreActivity,
  } = useUserActivityHistory(username);

  return (
    <Box>
      <Grid size={12} container>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <HomeProfileSection
            displayName={displayName}
            ratings={ratings}
            isLoading={isLoading}
            activityHistory={activityHistory}
            isActivityLoading={isActivityLoading}
            isActivityHistoryLoadingMore={isActivityLoadingMore}
            hasMoreActivityHistory={hasMoreActivity}
            onLoadMoreActivityHistory={loadMoreActivity}
            username={username}
            isAuthenticated={isAuthenticated}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }} sx={{ display: 'flex' }}>
          <Stack direction="column" sx={{ width: '100%', height: '100%' }}>
            <ContestsSection />
            <NewsSection />
            <Box sx={{ flexGrow: 1, width: 1, display: 'flex' }}>
              <TopUsersSection />
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Grid container size={12}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <BirthdaysSection />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <PostsSection />
        </Grid>

        <Grid size={12}>
          <UserActivitySection />
        </Grid>

        <Grid size={12}>
          <StatisticsSection />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
