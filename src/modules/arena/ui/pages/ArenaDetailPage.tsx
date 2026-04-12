import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert, Box, Grid, Skeleton, Stack } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import { useArenaLivePolling } from '../../application/hooks/useArenaLivePolling.ts';
import { useArenaStandingsPage } from '../../application/hooks/useArenaStandingsPage.ts';
import { useArenaStateContent } from '../../application/hooks/useArenaStateContent.ts';
import { useArenaChallenges, useArenaDetails, useArenaLiveChallenges, useArenaNextChallenge, useArenaPlayerStatistics, useArenaPlayers, useArenaStatistics, useArenaTopPlayers } from '../../application/queries.ts';
import { arenaQueries } from '../../application/queries.ts';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity.ts';
import ArenaChallengesList from '../components/ArenaChallengesList.tsx';
import ArenaCountdownCard from '../components/ArenaCountdownCard.tsx';
import ArenaInfoCard from '../components/ArenaInfoCard.tsx';
import ArenaPlayerStatisticsDialog from '../components/ArenaPlayerStatisticsDialog.tsx';
import ArenaPlayersTable from '../components/ArenaPlayersTable.tsx';
import ArenaQueueBanner from '../components/ArenaQueueBanner.tsx';
import ArenaStatisticsCard from '../components/ArenaStatisticsCard.tsx';
import ArenaWinnersCard from '../components/ArenaWinnersCard.tsx';


const PLAYERS_PAGE_SIZE = 10;
const CHALLENGES_PAGE_SIZE = 10;

const ArenaDetailPage = () => {
  const { id } = useParams();
  const { pathname, search } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [selectedUsername, setSelectedUsername] = useState<string | undefined>();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [transitionBanner, setTransitionBanner] = useState<{ severity: 'info' | 'success'; message: string } | null>(null);
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
    }),
    [playersPage],
  );

  const challengesFilters = useMemo(
    () => ({ page: state.challengesPage, pageSize: CHALLENGES_PAGE_SIZE }),
    [state.challengesPage],
  );
  const liveChallengesFilters = useMemo(
    () => ({ page: 1, pageSize: CHALLENGES_PAGE_SIZE }),
    [],
  );
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

  const { data: players, isLoading: isPlayersLoading, mutate: mutatePlayers } = useArenaPlayers(id, playersFilters, liveRefreshOptions);
  const { data: playerStatistics, isLoading: isStatisticsLoading } = useArenaPlayerStatistics(id, selectedUsername);
  const {
    data: challenges,
    isLoading: isChallengesLoading,
    mutate: mutateChallenges,
  } = useArenaChallenges(stateContent.isUpcoming ? undefined : id, challengesFilters, liveRefreshOptions);
  const {
    data: liveChallenges,
    isLoading: isLiveChallengesLoading,
    mutate: mutateLiveChallenges,
  } = useArenaLiveChallenges(stateContent.isOngoing ? id : undefined, liveChallengesFilters, liveChallengesRefreshOptions);
  const { data: topPlayers, mutate: mutateTopPlayers } = useArenaTopPlayers(stateContent.isFinished ? id : undefined, liveRefreshOptions);
  const { data: statistics, mutate: mutateStatistics } = useArenaStatistics(id, liveRefreshOptions);
  const {
    data: nextChallenge,
    mutate: mutateNextChallenge,
  } = useArenaNextChallenge(id, Boolean(arena?.isRegistrated) && stateContent.isOngoing);

  useDocumentTitle(
    arena?.title ? 'pageTitles.arenaTournament' : undefined,
    arena?.title
      ? {
          arenaTitle: arena.title,
        }
      : undefined,
  );

  const loginHref = useMemo(
    () => `${resources.Login}?next=${encodeURIComponent(`${pathname}${search}`)}`,
    [pathname, search],
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
  }, [mutateArena, mutateChallenges, mutateLiveChallenges, mutateNextChallenge, mutatePlayers, mutateStatistics, mutateTopPlayers, stateContent.isFinished, stateContent.isOngoing, stateContent.isUpcoming]);

  const handleSelectPlayer = useCallback(
    (player: ArenaPlayer) => {
      if (stateContent.isUpcoming) return;
      setSelectedUsername(player.username);
      setIsStatsModalOpen(true);
    },
    [stateContent.isUpcoming],
  );

  const handleRegister = useCallback(async () => {
    if (!id) return;
    await arenaQueries.arenaRepository.register(id);
    await revalidateArenaSections();
  }, [id, revalidateArenaSections]);

  const handleUnregister = useCallback(async () => {
    if (!id) return;
    await arenaQueries.arenaRepository.unregister(id);
    await revalidateArenaSections();
  }, [id, revalidateArenaSections]);

  const handleNextChallenge = useCallback(async () => {
    if (!id) return;
    const result = await arenaQueries.arenaRepository.loadNextChallenge(id);
    if (result?.challengeId) {
      navigate(`${getResourceById(resources.Challenge, result.challengeId)}?arena=${id}`);
    }
  }, [id, navigate]);

  const handlePauseToggle = useCallback(async () => {
    if (!id || !arena) return;
    if (arena.pause) {
      await arenaQueries.arenaRepository.start(id);
    } else {
      await arenaQueries.arenaRepository.pause(id);
    }
    await revalidateArenaSections();
  }, [arena, id, revalidateArenaSections]);

  useArenaLivePolling({
    arena,
    nextChallengeId: nextChallenge?.challengeId,
    onAutoOpenChallenge: (challengeId) =>
      navigate(`${getResourceById(resources.Challenge, challengeId)}?arena=${id}`),
    onStatusTransition: (status) => {
      const message =
        status === ArenaStatus.Already ? t('arena.transition.started') : t('arena.transition.finished');
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
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                  />
                  <ArenaStatisticsCard arena={arena} stats={statistics} titleKey={stateContent.insightsTitleKey} />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Stack direction="column" spacing={3}>
                  {stateContent.isFinished ? <ArenaWinnersCard topPlayers={topPlayers} /> : null}
                  <ArenaQueueBanner
                    arena={arena}
                    currentChallengeId={nextChallenge?.challengeId}
                    onOpenCurrentChallenge={handleNextChallenge}
                    onPauseToggle={handlePauseToggle}
                  />
                  <ArenaPlayersTable
                    data={players}
                    loading={isPlayersLoading}
                    page={players?.page ?? playersPage ?? 1}
                    pageSize={PLAYERS_PAGE_SIZE}
                    onPageChange={setPlayersPage}
                    onSelectPlayer={handleSelectPlayer}
                    selectedUsername={selectedUsername}
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

        <ArenaPlayerStatisticsDialog
          open={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          statistics={playerStatistics}
          loading={isStatisticsLoading}
          username={selectedUsername}
        />
      </Stack>
    </Box>
  );
};

export default ArenaDetailPage;
