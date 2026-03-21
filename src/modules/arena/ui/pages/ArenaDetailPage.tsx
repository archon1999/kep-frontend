import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert, Avatar, Box, Card, Chip, Grid, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import { useArenaLivePolling } from '../../application/hooks/useArenaLivePolling.ts';
import { useArenaStandingsPage } from '../../application/hooks/useArenaStandingsPage.ts';
import { useArenaStateContent } from '../../application/hooks/useArenaStateContent.ts';
import { useArenaChallenges, useArenaDetails, useArenaNextChallenge, useArenaPlayerStatistics, useArenaPlayers, useArenaStatistics, useArenaTopPlayers } from '../../application/queries.ts';
import { arenaQueries } from '../../application/queries.ts';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity.ts';
import ArenaChallengesList from '../components/ArenaChallengesList.tsx';
import ArenaCountdownCard from '../components/ArenaCountdownCard.tsx';
import ArenaInfoCard from '../components/ArenaInfoCard.tsx';
import ArenaPlayerStatisticsDialog from '../components/ArenaPlayerStatisticsDialog.tsx';
import ArenaPlayersTable from '../components/ArenaPlayersTable.tsx';
import ArenaStatisticsCard from '../components/ArenaStatisticsCard.tsx';
import ArenaWinnersCard from '../components/ArenaWinnersCard.tsx';


const PLAYERS_PAGE_SIZE = 10;

const ArenaDetailPage = () => {
  const { id } = useParams();
  const { pathname, search } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [selectedUsername, setSelectedUsername] = useState<string | undefined>();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [transitionBanner, setTransitionBanner] = useState<{ severity: 'info' | 'success'; message: string } | null>(null);

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

  const challengesFilters = useMemo(() => ({ page: 1, pageSize: 6 }), []);
  const liveRefreshOptions = useMemo(
    () => ({
      refreshInterval: 30000,
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
      stateContent.isFinished ? mutateTopPlayers() : Promise.resolve(undefined),
      stateContent.isOngoing ? mutateNextChallenge() : Promise.resolve(undefined),
    ]);
  }, [mutateArena, mutateChallenges, mutateNextChallenge, mutatePlayers, mutateStatistics, mutateTopPlayers, stateContent.isFinished, stateContent.isOngoing, stateContent.isUpcoming]);

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
      navigate(getResourceById(resources.Challenge, result.challengeId));
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
    onAutoOpenChallenge: (challengeId) => navigate(getResourceById(resources.Challenge, challengeId)),
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

  const headerTitle = useMemo(() => arena?.title ?? t('arena.title'), [arena?.title, t]);
  const statusLabel = useMemo(() => t(`arena.status.${stateContent.statusKey}`), [stateContent.statusKey, t]);
  const questionTimeLabel = useMemo(
    () =>
      arena?.questionTimeType === 2
        ? t('arena.questionTimeType.all')
        : t('arena.questionTimeType.one'),
    [arena?.questionTimeType, t],
  );
  const chapterPreview = useMemo(() => arena?.chapters?.slice(0, 4) ?? [], [arena?.chapters]);
  const extraChaptersCount = Math.max((arena?.chapters?.length ?? 0) - chapterPreview.length, 0);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, md: 3 },
            background: stateContent.isOngoing
              ? 'linear-gradient(135deg, rgba(46,125,50,0.18), rgba(255,193,7,0.12))'
              : stateContent.isFinished
                ? 'linear-gradient(135deg, rgba(255,193,7,0.18), rgba(84,110,122,0.10))'
                : 'linear-gradient(120deg, rgba(255,193,7,0.16), rgba(33,150,243,0.08))',
          }}
          background={1}
        >
          <Stack direction="column" spacing={2.5}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconifyIcon
                  icon={stateContent.isFinished ? 'mdi:trophy-award' : 'mdi:sword-cross'}
                  color="warning.main"
                  fontSize={34}
                />
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="h4" fontWeight={900}>
                    {headerTitle}
                  </Typography>
                </Stack>
              </Stack>

              {chapterPreview.map((chapter) => (
                <Tooltip title={chapter.title}>
                  <Avatar
                    key={chapter.id}
                    src={chapter.icon}
                    alt={chapter.title}
                    sx={{ width: 36, height: 36, border: '1px solid', borderColor: 'divider' }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Stack>
        </Card>

        {transitionBanner ? <Alert severity={transitionBanner.severity}>{transitionBanner.message}</Alert> : null}

        {isArenaLoading || !arena ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="column" spacing={3}>
                <ArenaCountdownCard arena={arena} />
                <ArenaInfoCard
                  arena={arena}
                  loginHref={loginHref}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  onNextChallenge={handleNextChallenge}
                  onPauseToggle={handlePauseToggle}
                />
                <ArenaStatisticsCard arena={arena} stats={statistics} titleKey={stateContent.insightsTitleKey} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="column" spacing={3}>
                {stateContent.isFinished ? <ArenaWinnersCard topPlayers={topPlayers} /> : null}
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
                  <ArenaChallengesList data={challenges} loading={isChallengesLoading} />
                ) : null}
              </Stack>
            </Grid>
          </Grid>
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
