import type { KepcoinRepository, KepcoinHistoryParams } from '../../domain/ports/kepcoin.repository';
import type {
  AccountConnectionsResponse,
  KepcoinHistoryResponse,
  KepcoinEarnHistoryItem,
  KepcoinSpendHistoryItem,
  KepcoinSummary,
  OneTimeTaskStartResponse,
  OneTimeTaskVerifyResponse,
  TaskCategoriesResponse,
} from '../../domain/entities/kepcoin.entity';
import { kepcoinApiClient } from '../api/kepcoin.client';
import { mapApiEarnHistoryToDomain, mapApiSpendHistoryToDomain } from '../mappers/kepcoin.mapper';

export class HttpKepcoinRepository implements KepcoinRepository {
  async getSummary(): Promise<KepcoinSummary> {
    const summary = await kepcoinApiClient.getSummary();

    return {
      balance: summary?.kepcoin ?? 0,
      streak: summary?.streak ?? 0,
      maxStreak: summary?.maxStreak ?? 0,
      streakFreeze: summary?.streakFreeze ?? 0,
    };
  }

  async getEarnHistory(params: KepcoinHistoryParams): Promise<KepcoinHistoryResponse<KepcoinEarnHistoryItem>> {
    const response = await kepcoinApiClient.listEarns(params);
    return mapApiEarnHistoryToDomain(response);
  }

  async getSpendHistory(params: KepcoinHistoryParams): Promise<KepcoinHistoryResponse<KepcoinSpendHistoryItem>> {
    const response = await kepcoinApiClient.listSpends(params);
    return mapApiSpendHistoryToDomain(response);
  }

  getTaskCategories(): Promise<TaskCategoriesResponse> {
    return kepcoinApiClient.getTaskCategories();
  }

  startTask(slug: string): Promise<OneTimeTaskStartResponse> {
    return kepcoinApiClient.startTask(slug);
  }

  verifyTask(slug: string): Promise<OneTimeTaskVerifyResponse> {
    return kepcoinApiClient.verifyTask(slug);
  }

  getAccountConnections(): Promise<AccountConnectionsResponse> {
    return kepcoinApiClient.getAccountConnections();
  }
}
