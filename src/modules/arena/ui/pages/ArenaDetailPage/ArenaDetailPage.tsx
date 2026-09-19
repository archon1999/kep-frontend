import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Alert, Box, Grid, Skeleton, Stack } from '@mui/material';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { useArenaLivePolling } from 'modules/arena/application/hooks/useArenaLivePolling.ts';
import { useArenaStandingsPage } from 'modules/arena/application/hooks/useArenaStandingsPage.ts';
import { useArenaStateContent } from 'modules/arena/application/hooks/useArenaStateContent.ts';
import {
  useArenaChallenges,
  useArenaDetails,
  useArenaHighlight,
  useArenaLiveChallenges,
  useArenaNextChallenge,
  useArenaPlayers,
  useArenaStatistics,
  useArenaTopPlayers,
} from 'modules/arena/application/queries.ts';
import { ArenaHighlight } from 'modules/arena/domain/entities/arena-highlight.entity.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginHref } from 'shared/lib/authRedirect';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ArenaChallengesList from './components/ArenaChallengesList.tsx';
import ArenaCountdownCard from './components/ArenaCountdownCard.tsx';
import ArenaInfoCard from './components/ArenaInfoCard.tsx';
import ArenaPlayersTable from './components/ArenaPlayersTable.tsx';
import ArenaQueueBanner from './components/ArenaQueueBanner.tsx';
import ArenaStatisticsCard from './components/ArenaStatisticsCard.tsx';
import ArenaWinnersCard from './components/ArenaWinnersCard.tsx';

const PLAYERS_PAGE_SIZE = 10;
const CHALLENGES_PAGE_SIZE = 10;
const HIGHLIGHT_VISIBLE_MS = 30000;

const ArenaDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const loginHref = useLoginHref();

  const [transitionBanner, setTransitionBanner] = useState<{
    severity: 'info' | 'success';
    message: string;
  } | null>(null);
  const [visibleHighlight, setVisibleHighlight] = useState<ArenaHighlight | undefined>();
  const [highlightRefreshTick, setHighlightRefreshTick] = useState(0);
  const { state, setField } = useRouteQueryState({
    defaults: {
      challengesPage: 1,
    },
    schema: {
      challengesPage: {
        ...numberParam({ min: 1 }),
        param: 'challengesPage',
      },
    },
    historyByKey: {
      challengesPage: 'push',
    },
  });

  const { data: arena, isLoading: isArenaLoading, mutate: mutateArena } = useArenaDetails(id, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
  const stateContent = useArenaStateContent(arena);
  const { playersPage, setPlayersPage, resetPlayersPage } = useArenaStandingsPage(arena);

  const playersFilters = useMemo(
    () => ({
      ...(playersPage ? { page: playersPage } : {}),
      pageSize: PLAYERS_PAGE_SIZE,
      pinCurrentUser: Boolean(currentUser?.username),
    }),
    [playersPage, currentUser?.username],
  );
  const challengesFilters = useMemo(
    () => ({ page: state.challengesPage, pageSize: CHALLENGES_PAGE_SIZE }),
    [state.challengesPage],
  );
  const liveChallengesFilters = useMemo(() => ({ page: 1, pageSize: CHALLENGES_PAGE_SIZE }), []);
  const liveRefreshOptions = useMemo(
    () => ({
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }),
    [],
  );
  const liveChallengesRefreshOptions = useMemo(
    () => ({
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }),
    [],
  );
  const highlightRefreshOptions = useMemo(
    () => ({
      onSuccess: () => setHighlightRefreshTick((value) => value + 1),
    }),
    [],
  );

  const { data: players, isLoading: isPlayersLoading, mutate: mutatePlayers } = useArenaPlayers(
    id,
    playersFilters,
    liveRefreshOptions,
  );
  const {
    data: challenges,
    isLoading: isChallengesLoading,
    mutate: mutateChallenges,
  } = useArenaChallenges(
    stateContent.isUpcoming ? undefined : id,
    challengesFilters,
    liveRefreshOptions,
  );
  const {
    data: liveChallenges,
    isLoading: isLiveChallengesLoading,
    mutate: mutateLiveChallenges,
  } = useArenaLiveChallenges(
    stateContent.isOngoing ? id : undefined,
    liveChallengesFilters,
    liveChallengesRefreshOptions,
  );
  const { data: topPlayers, mutate: mutateTopPlayers } = useArenaTopPlayers(
    stateContent.isFinished ? id : undefined,
    liveRefreshOptions,
  );
  const { data: statistics, mutate: mutateStatistics } = useArenaStatistics(
    id,
    liveRefreshOptions,
  );
  const { data: arenaHighlight } = useArenaHighlight(
    stateContent.isOngoing ? id : undefined,
    highlightRefreshOptions,
  );
  const { data: nextChallenge, mutate: mutateNextChallenge } = useArenaNextChallenge(
    id,
    Boolean(arena?.isRegistrated) && stateContent.isOngoing,
  );

  useDocumentTitle(
    arena?.title ? 'pageTitles.arenaTournament' : undefined,
    arena?.title
      ? {
          arenaTitle: arena.title,
        }
      : undefined,
  );

  const revalidateArenaSections = useCallback(async () => {
    await Promise.all([
      mutateArena(),
      mutatePlayers(),
      mutateStatistics(),
      stateContent.isUpcoming ? Promise.resolve(undefined) : mutateChallenges(),
      stateContent.isOngoing ? mutateLiveChallenges() : Promise.resolve(undefined),
      stateContent.isFinished ? mutateTopPlayers() : Promise.resolve(undefined),
      stateContent.isOngoing ? mutateNextChallenge() : Promise.resolve(undefined),
    ]);
  }, [
    mutateArena,
    mutateChallenges,
    mutateLiveChallenges,
    mutateNextChallenge,
    mutatePlayers,
    mutateStatistics,
    mutateTopPlayers,
    stateContent.isFinished,
    stateContent.isOngoing,
    stateContent.isUpcoming,
  ]);

  useArenaLivePolling({
    arena,
    nextChallengeId: nextChallenge?.challengeId,
    onAutoOpenChallenge: (challengeId) =>
      navigate(`${getResourceById(resources.Challenge, challengeId)}?arena=${id}`),
    onStatusTransition: (status) => {
      const message =
        status === ArenaStatus.Already
          ? t('arena.transition.started')
          : t('arena.transition.finished');
      const severity = status === ArenaStatus.Already ? 'success' : 'info';

      setTransitionBanner({ severity, message });
      if (severity === 'success') {
        toast.success(message);
      } else {
        toast.info(message);
      }
      void revalidateArenaSections();
    },
    onRefreshTick: () => {
      resetPlayersPage();
    },
  });

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
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {transitionBanner ? <Alert severity={transitionBanner.severity}>{transitionBanner.message}</Alert> : null}

        {isArenaLoading || !arena ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
          </Stack>
        ) : (
          <>
            <ArenaCountdownCard arena={arena} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack direction="column" spacing={3}>
                  <ArenaInfoCard
                    arena={arena}
                    loginHref={loginHref}
                    onChanged={revalidateArenaSections}
                  />
                  <ArenaStatisticsCard
                    arena={arena}
                    stats={statistics}
                    highlight={visibleHighlight}
                    titleKey={stateContent.insightsTitleKey}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Stack direction="column" spacing={3}>
                  {stateContent.isFinished ? <ArenaWinnersCard topPlayers={topPlayers} /> : null}
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
            </Grid>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ArenaDetailPage;
