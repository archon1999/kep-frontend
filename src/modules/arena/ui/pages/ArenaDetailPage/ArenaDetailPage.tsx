import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, Stack } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import {
  PLAYERS_PAGE_SIZE,
  useArenaDetailPage,
} from 'modules/arena/application/hooks/useArenaDetailPage';
import { ArenaHighlight } from 'modules/arena/domain/entities/arena-highlight.entity.ts';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ArenaChallengesList from './components/ArenaChallengesList.tsx';
import ArenaCountdownCard from './components/ArenaCountdownCard.tsx';
import ArenaInfoCard, { ArenaInfoCardSkeleton } from './components/ArenaInfoCard.tsx';
import ArenaPlayersTable from './components/ArenaPlayersTable.tsx';
import ArenaQueueBanner from './components/ArenaQueueBanner.tsx';
import ArenaStatisticsCard from './components/ArenaStatisticsCard.tsx';
import ArenaWinnersCard from './components/ArenaWinnersCard.tsx';

const HIGHLIGHT_VISIBLE_MS = 30000;

const ArenaDetailPage = () => {
  const { down } = useBreakpoints();
  const compactLayout = down('lg');
  const {
    id,
    currentUser,
    loginHref,
    state,
    setField,
    arena,
    isArenaLoading,
    arenaError,
    mutateArena,
    stateContent,
    playersPage,
    setPlayersPage,
    players,
    isPlayersLoading,
    challenges,
    isChallengesLoading,
    liveChallenges,
    isLiveChallengesLoading,
    topPlayers,
    isTopPlayersLoading,
    topPlayersError,
    retryTopPlayers,
    statistics,
    isStatisticsLoading,
    arenaHighlight,
    nextChallenge,
    revalidateArenaSections,
    transitionBanner,
    highlightRefreshTick,
  } = useArenaDetailPage();

  const { t } = useTranslation();
  const [visibleHighlight, setVisibleHighlight] = useState<ArenaHighlight | undefined>();

  useEffect(() => {
    if (!stateContent.isOngoing || !arenaHighlight) {
      setVisibleHighlight(undefined);
      return undefined;
    }

    setVisibleHighlight(arenaHighlight);
    const timer = window.setTimeout(() => setVisibleHighlight(undefined), HIGHLIGHT_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [arenaHighlight, highlightRefreshTick, stateContent.isOngoing]);

  return (
    <FramedPage>
      <Stack direction="column" spacing={0}>
        {transitionBanner ? (
          <Alert severity={transitionBanner.severity}>{transitionBanner.message}</Alert>
        ) : null}

        {isArenaLoading ? (
          <>
            <ArenaCountdownCard />
            {compactLayout && <ArenaInfoCardSkeleton />}
            <Grid container spacing={0}>
              <Grid
                size={{ xs: 12, lg: 8 }}
                sx={{ minWidth: 0, borderInlineEnd: { lg: '1px solid var(--kep-line)' } }}
              >
                <ArenaWinnersCard loading />
                <ArenaPlayersTable
                  loading
                  page={1}
                  pageSize={PLAYERS_PAGE_SIZE}
                  onPageChange={() => undefined}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                {!compactLayout && <ArenaInfoCardSkeleton />}
                <ArenaStatisticsCard loading />
              </Grid>
            </Grid>
          </>
        ) : arenaError || !arena ? (
          <>
            <ArenaCountdownCard />
            <Alert
              severity="error"
              sx={{ m: 'var(--kep-content-inset)' }}
              action={
                <Button color="inherit" onClick={() => void mutateArena()}>
                  {t('common.retry')}
                </Button>
              }
            >
              {t('arena.loadError')}
            </Alert>
          </>
        ) : (
          <>
            <ArenaCountdownCard arena={arena} />
            {compactLayout && (
              <ArenaInfoCard
                arena={arena}
                loginHref={loginHref}
                onChanged={revalidateArenaSections}
              />
            )}
            <Grid container spacing={0}>
              <Grid
                size={{ xs: 12, lg: 8 }}
                sx={{ minWidth: 0, borderInlineEnd: { lg: '1px solid var(--kep-line)' } }}
              >
                <Stack direction="column" spacing={0}>
                  {stateContent.isFinished ? (
                    <ArenaWinnersCard
                      topPlayers={topPlayers}
                      loading={isTopPlayersLoading}
                      error={topPlayersError}
                      onRetry={() => void retryTopPlayers()}
                    />
                  ) : null}
                  <ArenaQueueBanner
                    arena={arena}
                    arenaId={id}
                    currentChallengeId={nextChallenge?.challengeId}
                    onChanged={revalidateArenaSections}
                  />
                  <ArenaPlayersTable
                    arenaId={id}
                    data={players}
                    loading={isPlayersLoading}
                    page={players?.page ?? playersPage ?? 1}
                    pageSize={PLAYERS_PAGE_SIZE}
                    onPageChange={setPlayersPage}
                    currentUsername={currentUser?.username}
                    status={arena.status}
                  />
                  {!stateContent.isUpcoming ? (
                    <>
                      {stateContent.isOngoing ? (
                        <ArenaChallengesList
                          data={liveChallenges}
                          loading={isLiveChallengesLoading}
                          page={liveChallenges?.page ?? 1}
                          onPageChange={() => undefined}
                          titleKey="arena.liveChallenges"
                          emptyKey="arena.noLiveChallenges"
                          currentUsername={currentUser?.username}
                          showPagination={false}
                        />
                      ) : null}
                      <ArenaChallengesList
                        data={challenges}
                        loading={isChallengesLoading}
                        page={challenges?.page ?? state.challengesPage}
                        onPageChange={(value) => setField('challengesPage', value)}
                        currentUsername={currentUser?.username}
                      />
                    </>
                  ) : null}
                </Stack>
              </Grid>
              <Grid
                component="aside"
                size={{ xs: 12, lg: 4 }}
                sx={{ minWidth: 0, borderTop: { xs: '1px solid var(--kep-line)', lg: 0 } }}
              >
                {!compactLayout && (
                  <ArenaInfoCard
                    arena={arena}
                    loginHref={loginHref}
                    onChanged={revalidateArenaSections}
                  />
                )}
                <ArenaStatisticsCard
                  arena={arena}
                  stats={statistics}
                  loading={isStatisticsLoading}
                  highlight={visibleHighlight}
                  titleKey={stateContent.insightsTitleKey}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </FramedPage>
  );
};

export default ArenaDetailPage;
