import useSWR from 'swr';
import { gamesRepository } from '../data-access';
import { type GameId, type GamesLeaderboard, type LeaderboardId, gameIds } from '../domain';
import { gamesKeys } from './keys';
import { useGuestScoreClaim } from './useGuestScoreClaim';

export type GamesOverview = {
  playedCount: number;
  bestByGame: Partial<Record<GameId, number>>;
};

const emptyOverview = (): GamesOverview => ({ playedCount: 0, bestByGame: {} });

const fetchGamesOverview = async (): Promise<GamesOverview> => {
  const leaderboards = await Promise.all(gameIds.map((id) => gamesRepository.leaderboard(id)));
  return leaderboards.reduce<GamesOverview>((overview, leaderboard, index) => {
    if (leaderboard.currentUser) {
      overview.playedCount += 1;
      overview.bestByGame[gameIds[index]] = leaderboard.currentUser.score;
    }
    return overview;
  }, emptyOverview());
};

export const useGamesOverview = (username?: string) => {
  useGuestScoreClaim(username);
  const result = useSWR<GamesOverview>(
    username ? gamesKeys.overview(username) : null,
    fetchGamesOverview,
    {
      revalidateOnFocus: false,
      refreshInterval: 60_000,
    },
  );
  return { ...result, data: result.data ?? emptyOverview() };
};

export const useGamesLeaderboard = (id: LeaderboardId) =>
  useSWR<GamesLeaderboard>(gamesKeys.leaderboard(id), () => gamesRepository.leaderboard(id), {
    revalidateOnFocus: false,
    refreshInterval: 60_000,
  });
