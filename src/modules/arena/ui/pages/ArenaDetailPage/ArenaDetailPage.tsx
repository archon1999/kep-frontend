import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box } from '@mui/material';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { useArenaLivePolling } from 'modules/arena/application/hooks/useArenaLivePolling.ts';
import { useArenaStandingsPage } from 'modules/arena/application/hooks/useArenaStandingsPage.ts';
import { useArenaStateContent } from 'modules/arena/application/hooks/useArenaStateContent.ts';
import {
  arenaQueries,
  useArenaChallenges,
  useArenaDetails,
  useArenaHighlight,
  useArenaLiveChallenges,
  useArenaNextChallenge,
  useArenaPlayerStatistics,
  useArenaPlayers,
  useArenaStatistics,
  useArenaTopPlayers,
} from 'modules/arena/application/queries.ts';
import { ArenaHighlight } from 'modules/arena/domain/entities/arena-highlight.entity.ts';
import { ArenaPlayer } from 'modules/arena/domain/entities/arena-player.entity.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ArenaDetailPageContent from './ArenaDetailPageContent.tsx';

const PLAYERS_PAGE_SIZE = 10;
const CHALLENGES_PAGE_SIZE = 10;
const HIGHLIGHT_VISIBLE_MS = 30000;

const ArenaDetailPage = () => {
  const { id } = useParams();
  const { pathname, search } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [selectedUsername, setSelectedUsername] = useState<string | undefined>();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
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
    }),
    [playersPage],
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
  const { data: playerStatistics, isLoading: isStatisticsLoading } = useArenaPlayerStatistics(
    id,
    selectedUsername,
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
      <ArenaDetailPageContent
        arena={arena}
        isArenaLoading={isArenaLoading}
        transitionBanner={transitionBanner}
        loginHref={loginHref}
        isUpcoming={stateContent.isUpcoming}
        isOngoing={stateContent.isOngoing}
        isFinished={stateContent.isFinished}
        insightsTitleKey={stateContent.insightsTitleKey}
        statistics={statistics}
        visibleHighlight={visibleHighlight}
        topPlayers={topPlayers}
        nextChallengeId={nextChallenge?.challengeId}
        players={players}
        isPlayersLoading={isPlayersLoading}
        playersPage={playersPage ?? 1}
        currentUsername={currentUser?.username}
        selectedUsername={selectedUsername}
        onPlayersPageChange={setPlayersPage}
        onSelectPlayer={handleSelectPlayer}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        onOpenCurrentChallenge={handleNextChallenge}
        onPauseToggle={handlePauseToggle}
        liveChallenges={liveChallenges}
        isLiveChallengesLoading={isLiveChallengesLoading}
        challenges={challenges}
        challengesPage={state.challengesPage}
        isChallengesLoading={isChallengesLoading}
        onChallengesPageChange={(value) => setField('challengesPage', value)}
        isStatsModalOpen={isStatsModalOpen}
        onCloseStatsModal={() => setIsStatsModalOpen(false)}
        playerStatistics={playerStatistics}
        isStatisticsLoading={isStatisticsLoading}
      />
    </Box>
  );
};

export default ArenaDetailPage;
