import type {
  AccountConnectionsResponse,
  KepcoinEarnHistoryItem,
  KepcoinHistoryResponse,
  KepcoinSpendHistoryItem,
  KepcoinSummary,
  OneTimeTaskStartResponse,
  OneTimeTaskVerifyResponse,
  TaskCategoriesResponse,
} from '../entities/kepcoin.entity';

export interface KepcoinHistoryParams {
  page: number;
  pageSize: number;
}

export interface KepcoinRepository {
  getSummary: () => Promise<KepcoinSummary>;
  getEarnHistory: (params: KepcoinHistoryParams) => Promise<KepcoinHistoryResponse<KepcoinEarnHistoryItem>>;
  getSpendHistory: (params: KepcoinHistoryParams) => Promise<KepcoinHistoryResponse<KepcoinSpendHistoryItem>>;
  getTaskCategories: () => Promise<TaskCategoriesResponse>;
  startTask: (slug: string) => Promise<OneTimeTaskStartResponse>;
  verifyTask: (slug: string) => Promise<OneTimeTaskVerifyResponse>;
  getAccountConnections: () => Promise<AccountConnectionsResponse>;
}
