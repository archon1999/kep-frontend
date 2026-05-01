import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { authPaths } from 'app/routes/route-config';
import dayjs from 'dayjs';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import type { HomeUserActivityHistory, HomeUserRatings } from '../../domain/entities/home.entity';
import HomeActivityHistory from './HomeActivityHistory';
import RanksSection from './RanksSection';

interface GreetingCardProps {
  displayName: string;
  ratings?: HomeUserRatings | null;
  isLoading?: boolean;
  activityHistory?: HomeUserActivityHistory | null;
  isActivityLoading?: boolean;
  username?: string | null;
  isAuthenticated?: boolean;
  isActivityHistoryLoadingMore?: boolean;
  hasMoreActivityHistory?: boolean;
  onLoadMoreActivityHistory?: () => void;
}

const HomeProfileSection = ({
  displayName,
  ratings,
  isLoading,
  activityHistory,
  isActivityLoading,
  username,
  isAuthenticated = false,
  isActivityHistoryLoadingMore,
  hasMoreActivityHistory,
  onLoadMoreActivityHistory,
}: GreetingCardProps) => {
  const { t } = useTranslation();
  const todayLabel = useMemo(() => dayjs().format('dddd, MMM DD, YYYY'), []);

  return (
    <Paper background={1} sx={{ height: '100%' }}>
      <Stack
        direction="column"
        sx={{
          ...responsivePagePaddingSx,
          gap: 3,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <Stack direction="column" spacing={1}>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {todayLabel}
          </Typography>

          <Typography
            variant="h5"
            display="flex"
            columnGap={1}
            flexWrap="wrap"
            dangerouslySetInnerHTML={{
              __html: t('homePage.greeting.goodMorning', { name: displayName }),
            }}
          />
          {!isAuthenticated && (
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('homePage.greeting.loginPrompt')}
              </Typography>
              <Button component={RouterLink} to={authPaths.login} size="small" variant="contained">
                {t('homePage.greeting.loginCta')}
              </Button>
            </Stack>
          )}
        </Stack>

        <Divider />

        <RanksSection ratings={ratings} isLoading={isLoading} />

        <Divider />

        <HomeActivityHistory
          username={username}
          history={activityHistory}
          isLoading={isActivityLoading}
          isLoadingMore={isActivityHistoryLoadingMore}
          hasMore={hasMoreActivityHistory}
          onLoadMore={onLoadMoreActivityHistory}
        />
      </Stack>
    </Paper>
  );
};

export default HomeProfileSection;
