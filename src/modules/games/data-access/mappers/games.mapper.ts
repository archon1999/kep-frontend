import type { GameId, GamesLeaderboard, LeaderboardPlayer, ScoreSubmission } from '../../domain';

export type ApiLeaderboardPlayer = {
  rank: number;
  userId: number;
  username: string;
  avatar: string | null;
  score: number;
  isCurrentUser: boolean;
  isTopThree: boolean;
};

export type ApiGamesLeaderboard = {
  gameId: GameId | null;
  top: ApiLeaderboardPlayer[];
  currentUser: ApiLeaderboardPlayer | null;
  totalPlayers: number;
};

export type ApiScoreSubmission = {
  gameId: GameId;
  score: number;
  bestScore: number;
  improved: boolean;
};

const mapPlayer = (player: ApiLeaderboardPlayer): LeaderboardPlayer => ({
  rank: player.rank,
  userId: player.userId,
  username: player.username,
  avatar: player.avatar,
  score: player.score,
  isCurrentUser: player.isCurrentUser,
  isTopThree: player.isTopThree,
});

export const mapLeaderboard = (payload: ApiGamesLeaderboard): GamesLeaderboard => ({
  gameId: payload.gameId,
  top: payload.top.slice(0, 10).map(mapPlayer),
  currentUser: payload.currentUser ? mapPlayer(payload.currentUser) : null,
  totalPlayers: payload.totalPlayers,
});

export const mapScoreSubmission = (payload: ApiScoreSubmission): ScoreSubmission => ({
  gameId: payload.gameId,
  score: payload.score,
  bestScore: payload.bestScore,
  improved: payload.improved,
});
