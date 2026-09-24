import type { GameId, GamesLeaderboard, LeaderboardId, ScoreSubmission } from '../entities';

export interface GamesRepository {
  leaderboard(id: LeaderboardId): Promise<GamesLeaderboard>;
  submitScore(id: GameId, score: number): Promise<ScoreSubmission>;
}
