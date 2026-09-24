import { instance } from 'shared/api/http/axiosInstance';
import type { GameId, LeaderboardId } from '../../domain';
import type { ApiGamesLeaderboard, ApiScoreSubmission } from '../mappers/games.mapper';

export const gamesApiClient = {
  leaderboard: async (id: LeaderboardId): Promise<ApiGamesLeaderboard> => {
    const response = await instance.get<ApiGamesLeaderboard>(`/api/games/leaderboards/${id}/`);
    return response.data;
  },
  submitScore: async (gameId: GameId, score: number): Promise<ApiScoreSubmission> => {
    const response = await instance.post<ApiScoreSubmission>('/api/games/scores/', {
      gameId,
      score,
    });
    return response.data;
  },
};
