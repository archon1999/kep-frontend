import type { GameId, GamesRepository, LeaderboardId } from '../../domain';
import { gamesApiClient } from '../api/games.client';
import { mapLeaderboard, mapScoreSubmission } from '../mappers';

export class HttpGamesRepository implements GamesRepository {
  async leaderboard(id: LeaderboardId) {
    return mapLeaderboard(await gamesApiClient.leaderboard(id));
  }

  async submitScore(id: GameId, score: number) {
    return mapScoreSubmission(await gamesApiClient.submitScore(id, score));
  }
}

export const gamesRepository = new HttpGamesRepository();
