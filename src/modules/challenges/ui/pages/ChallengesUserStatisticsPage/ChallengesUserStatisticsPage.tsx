import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import {
  useChallengeUserStatistics,
  useUserChallenges,
} from 'modules/challenges/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import PageBreadcrumb from 'shared/components/sections/common/PageBreadcrumb';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import StatisticsActivity from './components/StatisticsActivity';
import StatisticsHistory from './components/StatisticsHistory';
import StatisticsKnowledge from './components/StatisticsKnowledge';
import StatisticsKpis from './components/StatisticsKpis';
import StatisticsOpponents from './components/StatisticsOpponents';
import StatisticsRatingPanel from './components/StatisticsRatingPanel';
import StatisticsRecords from './components/StatisticsRecords';
import StatisticsResults from './components/StatisticsResults';
import { statisticsInset, statisticsPanelSx } from './components/statisticsStyles';

const ChallengesUserStatisticsPage = () => {
  const { t } = useTranslation();
  const { currentUser, isAuthLoading } = useAuth();
  const username = currentUser?.username;
  const { state, setField } = useRouteQueryState<{ page: number; selectedYear?: number }>({
    defaults: { page: 1, selectedYear: undefined },
    schema: {
      page: numberParam({ min: 1 }),
      selectedYear: { ...numberParam({ min: 1, max: 9999 }), param: 'year' },
    },
    historyByKey: { page: 'push' },
  });
  const statisticsQuery = useChallengeUserStatistics(username);
  const historyQuery = useUserChallenges({ username, page: state.page, pageSize: 6 });
  const statistics = statisticsQuery.data;
  const loading = isAuthLoading || statisticsQuery.isLoading;
  const hasChallenges = statistics?.general
    ? statistics.general.totalChallenges > 0
    : Boolean(statistics?.ratingHistory.length);
  const history = (
    <Paper sx={statisticsPanelSx}>
      <StatisticsHistory
        embedded
        username={username ?? ''}
        challenges={historyQuery.data?.data ?? []}
        ratingHistory={statistics?.ratingHistory}
        isLoading={historyQuery.isLoading}
        error={historyQuery.error}
        onRetry={() => void historyQuery.mutate()}
        page={state.page}
        pagesCount={historyQuery.data?.pagesCount ?? 0}
        onPageChange={(page) => setField('page', page)}
      />
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: 'background.paper', minWidth: 0 }}>
      <Paper sx={[statisticsPanelSx, { px: statisticsInset, py: 3 }]}>
        <PageBreadcrumb
          items={[
            { label: t('challenges.title'), url: resources.Challenges },
            { label: t('contests.tabs.statistics'), active: true },
          ]}
          sx={{ mb: 1.5 }}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
          gap={2}
        >
          <Typography variant="h4" component="h1">
            {t('challenges.statisticsTitle')}
          </Typography>
          <Stack direction="row" alignItems="center" gap={3}>
            {username && (
              <Link
                component={RouterLink}
                to={getResourceByUsername(resources.UserProfile, username)}
                underline="none"
                color="text.primary"
                sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}
              >
                <Avatar
                  src={currentUser?.avatar ?? undefined}
                  alt={username}
                  sx={{ width: 32, height: 32 }}
                >
                  {username.slice(0, 1)}
                </Avatar>
                <Typography variant="body2" fontWeight={600}>
                  {username}
                </Typography>
              </Link>
            )}
            <Button
              component={RouterLink}
              to={resources.Challenges}
              variant="outlined"
              color="neutral"
              size="small"
              startIcon={<IconifyIcon icon="material-symbols:arrow-back-rounded" />}
            >
              {t('challenges.backToList')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      {loading ? (
        <Grid container>
          {[5, 7, 5, 7].map((size, index) => (
            <Grid size={{ xs: 12, xl: size }} key={index}>
              <Paper sx={[statisticsPanelSx, { p: statisticsInset }]}>
                <Skeleton height={400} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : !username ? (
        <Alert severity="info" sx={{ m: statisticsInset }}>
          {t('challenges.authRequired')}
        </Alert>
      ) : statisticsQuery.error ? (
        <>
          <Alert
            severity="error"
            sx={{ m: statisticsInset }}
            action={
              <Button color="inherit" onClick={() => void statisticsQuery.mutate()}>
                {t('challenges.statisticsPage.retry')}
              </Button>
            }
          >
            {t('challenges.statisticsPage.error')}
          </Alert>
          {history}
        </>
      ) : !statistics || !hasChallenges ? (
        <>
          <Stack alignItems="center" spacing={2} sx={{ p: 6, textAlign: 'center' }}>
            <KepIcon name="challenges" sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography variant="h6">{t('challenges.noChallenges')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.statisticsPage.overview.noChallenges')}
            </Typography>
            <Button component={RouterLink} to={resources.Challenges} variant="contained">
              {t('challenges.statisticsPage.overview.startChallenge')}
            </Button>
          </Stack>
          {history}
        </>
      ) : (
        <Grid container>
          <Grid size={{ xs: 12, xl: 5 }}>
            <StatisticsKpis statistics={statistics} />
          </Grid>
          <Grid size={{ xs: 12, xl: 7 }}>
            <Paper sx={statisticsPanelSx}>
              <StatisticsRatingPanel statistics={statistics} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, xl: 5 }}>
            <Paper sx={statisticsPanelSx}>
              <StatisticsResults statistics={statistics} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, xl: 7 }}>{history}</Grid>
          <Grid size={{ xs: 12, xl: 7 }}>
            <Paper sx={statisticsPanelSx}>
              <StatisticsActivity
                statistics={statistics}
                selectedYear={state.selectedYear}
                onYearChange={(year) => setField('selectedYear', year)}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, xl: 5 }}>
            <StatisticsRecords statistics={statistics} />
          </Grid>
          <Grid size={12}>
            <StatisticsKnowledge statistics={statistics} />
          </Grid>
          <Grid size={12}>
            <StatisticsOpponents statistics={statistics} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ChallengesUserStatisticsPage;
