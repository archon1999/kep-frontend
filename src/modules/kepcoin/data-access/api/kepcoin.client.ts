import { apiClient } from 'shared/api';
import type {
  ApiKepcoinEarnsList200,
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsList200,
  ApiKepcoinSpendsListParams,
  KepCoinBalance,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import type {
  AccountConnectionsResponse,
  OneTimeTaskStartResponse,
  OneTimeTaskVerifyResponse,
  TaskCategoriesResponse,
} from '../../domain/entities/kepcoin.entity';

export interface ApiKepcoinSummaryResponse {
  kepcoin?: number;
  streak?: number;
  maxStreak?: number;
  streakFreeze?: number;
}

interface ApiStreakResponse {
  streak?: number;
  maxStreak?: number;
  max_streak?: number;
  streakFreeze?: number;
  streak_freeze?: number;
}

export const kepcoinApiClient = {
  getSummary: async (): Promise<ApiKepcoinSummaryResponse> => {
    const [balanceResponse, streakResponse] = await Promise.all([
      apiClient.apiMyKepcoinList() as Promise<KepCoinBalance>,
      apiClient.apiStreakList() as unknown as Promise<ApiStreakResponse>,
    ]);

    return {
      kepcoin: balanceResponse?.kepcoin,
      streak: streakResponse?.streak,
      maxStreak: streakResponse?.maxStreak ?? streakResponse?.max_streak,
      streakFreeze: streakResponse?.streakFreeze ?? streakResponse?.streak_freeze,
    };
  },
  listEarns: (params: ApiKepcoinEarnsListParams) =>
    apiClient.apiKepcoinEarnsList(params) as Promise<ApiKepcoinEarnsList200>,
  listSpends: (params: ApiKepcoinSpendsListParams) =>
    apiClient.apiKepcoinSpendsList(params) as Promise<ApiKepcoinSpendsList200>,
  getTaskCategories: () =>
    axiosFetcher(['/api/kepcoin-tasks', { method: 'get' }]) as Promise<TaskCategoriesResponse>,
  startTask: (slug: string) =>
    axiosFetcher([
      `/api/kepcoin-tasks/${slug}/start`,
      { method: 'post' },
    ]) as Promise<OneTimeTaskStartResponse>,
  verifyTask: (slug: string) =>
    axiosFetcher([
      `/api/kepcoin-tasks/${slug}/verify`,
      { method: 'post' },
    ]) as Promise<OneTimeTaskVerifyResponse>,
  getAccountConnections: () =>
    axiosFetcher([
      '/api/kepcoin-tasks/account-connections',
      { method: 'get' },
    ]) as Promise<AccountConnectionsResponse>,
};
