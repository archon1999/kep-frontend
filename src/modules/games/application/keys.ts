import type { LeaderboardId } from '../domain';

export const gamesKeys = {
  leaderboard: (id: LeaderboardId) => ['games-leaderboard', id] as const,
  overview: (username: string) => ['games-overview', username] as const,
};
