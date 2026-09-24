export const gameIds = [
  'code-islands',
  'keppy-world',
  'bug-hunt',
  'logic-circuit',
  'memory-grid',
] as const;

export type GameId = (typeof gameIds)[number];
export type LeaderboardId = GameId | 'overall';

export type LeaderboardPlayer = {
  rank: number;
  userId: number;
  username: string;
  avatar: string | null;
  score: number;
  isCurrentUser: boolean;
  isTopThree: boolean;
};

export type GamesLeaderboard = {
  gameId: GameId | null;
  top: LeaderboardPlayer[];
  currentUser: LeaderboardPlayer | null;
  totalPlayers: number;
};

export type ScoreSubmission = {
  gameId: GameId;
  score: number;
  bestScore: number;
  improved: boolean;
};
