import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Avatar, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { statisticsInset, statisticsPanelSx } from 'app/theme/styles/statistics';
import { useChallengesUserStatisticsPage } from 'modules/challenges/application/hooks/useChallengesUserStatisticsPage';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import EmptyState from 'shared/components/common/EmptyState';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ChallengesStatisticsSkeleton from './components/ChallengesStatisticsSkeleton';
import StatisticsActivity from './components/StatisticsActivity';
import StatisticsHistory from './components/StatisticsHistory';
import StatisticsKnowledge from './components/StatisticsKnowledge';
import StatisticsKpis from './components/StatisticsKpis';
import StatisticsOpponents from './components/StatisticsOpponents';
import StatisticsRatingPanel from './components/StatisticsRatingPanel';
import StatisticsRecords from './components/StatisticsRecords';
import StatisticsResults from './components/StatisticsResults';

const ChallengesUserStatisticsPage = () => {
  const {
    currentUser,
    state,
    setField,
    statisticsQuery,
    historyQuery,
    username,
    statistics,
    loading,
    hasChallenges,
  } = useChallengesUserStatisticsPage();

  const { t } = useTranslation();
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
    <FramedPage>
      <PageHeader
        variant="detail"
        title={t('challenges.statisticsTitle')}
        backTo={resources.Challenges}
        navigationComponent={
          username && (loading || (statistics && hasChallenges)) ? (
            <Stack
              direction="row"
              gap={1}
              useFlexGap
              sx={{
                maxWidth: '100%',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {['overview', 'activity', 'knowledge', 'opponents'].map((section) => (
                <Button
                  key={section}
                  component="a"
                  href={`#challenge-stats-${section}`}
                  size="small"
                  variant="text"
                  sx={{ flexShrink: 0 }}
                >
                  {t(`challenges.statisticsPage.tabs.${section}`)}
                </Button>
              ))}
            </Stack>
          ) : undefined
        }
        actionComponent={
          <Stack direction="row" alignItems="center" gap={3}>
            {username && (
              <UserPopover
                username={username}
                avatar={currentUser?.avatar ?? undefined}
                sx={{ gap: 1.5 }}
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
              </UserPopover>
            )}
          </Stack>
        }
      />
      {loading ? (
        <ChallengesStatisticsSkeleton />
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
          <EmptyState
            kind="battles"
            title={t('challenges.noChallenges')}
            description={t('challenges.statisticsPage.overview.noChallenges')}
            action={
              <Button component={RouterLink} to={resources.Challenges} variant="contained">
                {t('challenges.statisticsPage.overview.startChallenge')}
              </Button>
            }
          />
          {history}
        </>
      ) : (
        <Grid container>
          <Grid size={12} id="challenge-stats-overview" sx={{ scrollMarginTop: 100 }}>
            <StatisticsKpis statistics={statistics} />
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper sx={statisticsPanelSx}>
              <StatisticsRatingPanel statistics={statistics} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper sx={statisticsPanelSx}>
              <StatisticsResults statistics={statistics} />
            </Paper>
          </Grid>
          <Grid size={12}>{history}</Grid>
          <Grid
            size={{ xs: 12, lg: 7 }}
            id="challenge-stats-activity"
            sx={{ scrollMarginTop: 100 }}
          >
            <Paper sx={statisticsPanelSx}>
              <StatisticsActivity
                statistics={statistics}
                selectedYear={state.selectedYear}
                onYearChange={(year) => setField('selectedYear', year)}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <StatisticsRecords statistics={statistics} />
          </Grid>
          <Grid size={12} id="challenge-stats-knowledge" sx={{ scrollMarginTop: 100 }}>
            <StatisticsKnowledge statistics={statistics} />
          </Grid>
          <Grid size={12} id="challenge-stats-opponents" sx={{ scrollMarginTop: 100 }}>
            <StatisticsOpponents statistics={statistics} />
          </Grid>
        </Grid>
      )}
    </FramedPage>
  );
};

export default ChallengesUserStatisticsPage;
