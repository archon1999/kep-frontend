import { useMemo, useState } from 'react';
import { Box, Button, Card, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSWRConfig } from 'swr';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { arenaQueries, useArenaChallenges, useArenaDetails, useArenaPlayerStatistics, useArenaPlayers, useArenaStatistics, useArenaTopPlayers } from '../../application/queries.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity.ts';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import ArenaInfoCard from '../components/ArenaInfoCard.tsx';
import ArenaCountdownCard from '../components/ArenaCountdownCard.tsx';
import ArenaPlayersTable from '../components/ArenaPlayersTable.tsx';
import ArenaChallengesList from '../components/ArenaChallengesList.tsx';
import ArenaStatisticsCard from '../components/ArenaStatisticsCard.tsx';
import ArenaWinnersCard from '../components/ArenaWinnersCard.tsx';
import ArenaPlayerStatisticsDialog from '../components/ArenaPlayerStatisticsDialog.tsx';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ArenaDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { data: arena, isLoading: isArenaLoading, mutate: mutateArena } = useArenaDetails(id);
  const [playersPage, setPlayersPage] = useState(1);
  const [selectedUsername, setSelectedUsername] = useState<string | undefined>();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const { data: players, isLoading: isPlayersLoading } = useArenaPlayers(id, { page: playersPage, pageSize: 10 });
  const { data: playerStatistics, isLoading: isStatisticsLoading } = useArenaPlayerStatistics(id, selectedUsername);
  const { data: challenges, isLoading: isChallengesLoading } = useArenaChallenges(id, { page: 1, pageSize: 6 });
  const { data: topPlayers } = useArenaTopPlayers(id);
  const { data: statistics } = useArenaStatistics(id);
  useDocumentTitle(
    arena?.title ? 'pageTitles.arenaTournament' : undefined,
    arena?.title
      ? {
          arenaTitle: arena.title,
        }
      : undefined,
  );

  const handleSelectPlayer = (player: ArenaPlayer) => {
    setSelectedUsername(player.username);
    setIsStatsModalOpen(true);
  };

  const handleRegister = async () => {
    if (!id) return;
    await arenaQueries.arenaRepository.register(id);
    await mutateArena();
    await mutate(['arena-players', id, { page: playersPage, pageSize: 10 }]);
  };

  const handleNextChallenge = async () => {
    if (!id) return;
    const result = await arenaQueries.arenaRepository.loadNextChallenge(id);
    if (result?.challengeId) {
      navigate(getResourceById(resources.Challenge, result.challengeId));
    }
  };

  const handlePauseToggle = async () => {
    if (!id || !arena) return;
    if (arena.pause) {
      await arenaQueries.arenaRepository.start(id);
    } else {
      await arenaQueries.arenaRepository.pause(id);
    }
    await mutateArena();
  };

  const headerTitle = useMemo(() => arena?.title ?? t('arena.title'), [arena?.title, t]);
  const statusLabel = useMemo(() => {
    if (!arena) return t('arena.status.upcoming');
    if (arena.status === ArenaStatus.NotStarted) return t('arena.status.upcoming');
    if (arena.status === ArenaStatus.Already) return t('arena.status.live');
    return t('arena.status.finished');
  }, [arena, t]);
  const statusChipColor: 'warning' | 'success' | 'default' =
    arena?.status === ArenaStatus.Already ? 'success' : arena?.status === ArenaStatus.Finished ? 'default' : 'warning';

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, md: 3 },
            background: 'linear-gradient(120deg, rgba(255,193,7,0.16), rgba(76,175,80,0.08))',
            border: '1px solid',
            borderColor: 'warning.lighter',
          }}
          background={1}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <IconifyIcon icon="mdi:sword-cross" color="warning.main" fontSize={32} />
              <Stack direction="row" spacing={0.5}>
                <Typography variant="h4" fontWeight={800}>
                  {headerTitle}
                </Typography>
              </Stack>
            </Stack>
            {arena ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                <Chip
                  color={statusChipColor}
                  variant="soft"
                  icon={<IconifyIcon icon="mdi:flash" fontSize={18} />}
                  label={statusLabel}
                />
                <Chip
                  color="warning"
                  variant="soft"
                  icon={<IconifyIcon icon="mdi:timer-outline" fontSize={18} />}
                  label={`${arena.timeSeconds}s`}
                />
                <Chip
                  color="info"
                  variant="soft"
                  icon={<IconifyIcon icon="mdi:help-circle-outline" fontSize={18} />}
                  label={`${arena.questionsCount} ${t('arena.questions')}`}
                />
              </Stack>
            ) : null}
          </Stack>
        </Card>

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
                <ArenaInfoCard arena={arena} onRegister={handleRegister} onNextChallenge={handleNextChallenge} />
                <ArenaCountdownCard arena={arena} />
                <ArenaStatisticsCard stats={statistics} />
                {arena.status === ArenaStatus.Already ? (
                  <Button variant="outlined" color={arena.pause ? 'warning' : 'success'} onClick={handlePauseToggle}>
                    {arena.pause ? t('arena.actions.start') : t('arena.actions.pause')}
                  </Button>
                ) : null}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="column" spacing={3}>
                {arena.status === ArenaStatus.Finished ? <ArenaWinnersCard topPlayers={topPlayers} /> : null}
                <ArenaPlayersTable
                  data={players}
                  loading={isPlayersLoading}
                  page={playersPage}
                  pageSize={10}
                  onPageChange={setPlayersPage}
                  onSelectPlayer={handleSelectPlayer}
                  selectedUsername={selectedUsername}
                  currentUsername={currentUser?.username}
                  status={arena.status}
                />
                <ArenaChallengesList data={challenges} loading={isChallengesLoading} />
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
