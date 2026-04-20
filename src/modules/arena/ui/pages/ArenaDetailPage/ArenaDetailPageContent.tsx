import { Alert, Grid, Skeleton, Stack } from '@mui/material';
import { Arena } from 'modules/arena/domain/entities/arena.entity.ts';
import { ArenaChallenge } from 'modules/arena/domain/entities/arena-challenge.entity.ts';
import { ArenaHighlight } from 'modules/arena/domain/entities/arena-highlight.entity.ts';
import { ArenaPlayer } from 'modules/arena/domain/entities/arena-player.entity.ts';
import { ArenaPlayerStatistics } from 'modules/arena/domain/entities/arena-player-statistics.entity.ts';
import { ArenaStatistics } from 'modules/arena/domain/entities/arena-statistics.entity.ts';
import { PageResult } from 'modules/arena/domain/ports/arena.repository.ts';
import ArenaDetailPageCountdownCard from './components/ArenaDetailPageCountdownCard.tsx';
import ArenaDetailPageInfoCard from './components/ArenaDetailPageInfoCard.tsx';
import ArenaDetailPageStatisticsCard from './components/ArenaDetailPageStatisticsCard.tsx';
import ArenaDetailPageWinnersCard from './components/ArenaDetailPageWinnersCard.tsx';
import ArenaDetailPageQueueBanner from './components/ArenaDetailPageQueueBanner.tsx';
import ArenaDetailPagePlayersTable from './components/ArenaDetailPagePlayersTable.tsx';
import ArenaDetailPageChallengesList from './components/ArenaDetailPageChallengesList.tsx';
import ArenaDetailPagePlayerStatisticsDialog from './dialogs/ArenaDetailPagePlayerStatisticsDialog.tsx';

type Props = {
  arena?: Arena;
  isArenaLoading: boolean;
  transitionBanner: { severity: 'info' | 'success'; message: string } | null;
  loginHref: string;
  isUpcoming: boolean;
  isOngoing: boolean;
  isFinished: boolean;
  insightsTitleKey: string;
  statistics?: ArenaStatistics;
  visibleHighlight?: ArenaHighlight;
  topPlayers?: ArenaPlayerStatistics[];
  nextChallengeId?: number;
  players?: PageResult<ArenaPlayer>;
  isPlayersLoading: boolean;
  playersPage: number;
  currentUsername?: string;
  selectedUsername?: string;
  onPlayersPageChange: (page: number) => void;
  onSelectPlayer: (player: ArenaPlayer) => void;
  onRegister: () => Promise<void>;
  onUnregister: () => Promise<void>;
  onOpenCurrentChallenge: () => Promise<void>;
  onPauseToggle: () => Promise<void>;
  liveChallenges?: PageResult<ArenaChallenge>;
  isLiveChallengesLoading: boolean;
  challenges?: PageResult<ArenaChallenge>;
  challengesPage: number;
  isChallengesLoading: boolean;
  onChallengesPageChange: (page: number) => void;
  isStatsModalOpen: boolean;
  onCloseStatsModal: () => void;
  playerStatistics?: ArenaPlayerStatistics;
  isStatisticsLoading: boolean;
};

const PLAYERS_PAGE_SIZE = 10;

const ArenaDetailPageContent = ({
  arena,
  isArenaLoading,
  transitionBanner,
  loginHref,
  isUpcoming,
  isOngoing,
  isFinished,
  insightsTitleKey,
  statistics,
  visibleHighlight,
  topPlayers,
  nextChallengeId,
  players,
  isPlayersLoading,
  playersPage,
  currentUsername,
  selectedUsername,
  onPlayersPageChange,
  onSelectPlayer,
  onRegister,
  onUnregister,
  onOpenCurrentChallenge,
  onPauseToggle,
  liveChallenges,
  isLiveChallengesLoading,
  challenges,
  challengesPage,
  isChallengesLoading,
  onChallengesPageChange,
  isStatsModalOpen,
  onCloseStatsModal,
  playerStatistics,
  isStatisticsLoading,
}: Props) => (
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
        <ArenaDetailPageCountdownCard arena={arena} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="column" spacing={3}>
              <ArenaDetailPageInfoCard
                arena={arena}
                loginHref={loginHref}
                onRegister={onRegister}
                onUnregister={onUnregister}
              />
              <ArenaDetailPageStatisticsCard
                arena={arena}
                stats={statistics}
                highlight={visibleHighlight}
                titleKey={insightsTitleKey}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="column" spacing={3}>
              {isFinished ? <ArenaDetailPageWinnersCard topPlayers={topPlayers} /> : null}
              <ArenaDetailPageQueueBanner
                arena={arena}
                currentChallengeId={nextChallengeId}
                onOpenCurrentChallenge={onOpenCurrentChallenge}
                onPauseToggle={onPauseToggle}
              />
              <ArenaDetailPagePlayersTable
                data={players}
                loading={isPlayersLoading}
                page={players?.page ?? playersPage ?? 1}
                pageSize={PLAYERS_PAGE_SIZE}
                onPageChange={onPlayersPageChange}
                onSelectPlayer={onSelectPlayer}
                selectedUsername={selectedUsername}
                currentUsername={currentUsername}
                status={arena.status}
              />
              {!isUpcoming ? (
                <>
                  {isOngoing ? (
                    <ArenaDetailPageChallengesList
                      data={liveChallenges}
                      loading={isLiveChallengesLoading}
                      page={liveChallenges?.page ?? 1}
                      onPageChange={() => undefined}
                      titleKey="arena.liveChallenges"
                      emptyKey="arena.noLiveChallenges"
                      currentUsername={currentUsername}
                      showPagination={false}
                    />
                  ) : null}
                  <ArenaDetailPageChallengesList
                    data={challenges}
                    loading={isChallengesLoading}
                    page={challenges?.page ?? challengesPage}
                    onPageChange={onChallengesPageChange}
                    currentUsername={currentUsername}
                  />
                </>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </>
    )}

    <ArenaDetailPagePlayerStatisticsDialog
      open={isStatsModalOpen}
      onClose={onCloseStatsModal}
      statistics={playerStatistics}
      loading={isStatisticsLoading}
      username={selectedUsername}
    />
  </Stack>
);

export default ArenaDetailPageContent;
