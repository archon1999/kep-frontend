import useSWR from 'swr';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';
import type {
  AccountConnectionsResponse,
  KepcoinEarnHistoryItem,
  KepcoinHistoryResponse,
  KepcoinSpendHistoryItem,
  KepcoinSummary,
  TaskCategoriesResponse,
} from '../domain/entities/kepcoin.entity';

const repository = new HttpKepcoinRepository();

export const useKepcoinSummary = () =>
  useSWR<KepcoinSummary>(['kepcoin-summary'], () => repository.getSummary(), {
    revalidateOnFocus: false,
  });

export const useKepcoinEarnHistory = (page: number, pageSize: number, enabled = true) =>
  useSWR<KepcoinHistoryResponse<KepcoinEarnHistoryItem>>(
    enabled ? ['kepcoin-earns', page, pageSize] : null,
    () => repository.getEarnHistory({ page, pageSize }),
    { keepPreviousData: true },
  );

export const useKepcoinSpendHistory = (page: number, pageSize: number, enabled = true) =>
  useSWR<KepcoinHistoryResponse<KepcoinSpendHistoryItem>>(
    enabled ? ['kepcoin-spends', page, pageSize] : null,
    () => repository.getSpendHistory({ page, pageSize }),
    { keepPreviousData: true },
  );

export const useTaskCategories = (enabled = true) =>
  useSWR<TaskCategoriesResponse>(
    enabled ? ['kepcoin-task-categories'] : null,
    () => repository.getTaskCategories(),
    {
      revalidateOnFocus: false,
    },
  );

export const useAccountConnections = (enabled = true) =>
  useSWR<AccountConnectionsResponse>(
    enabled ? ['kepcoin-account-connections'] : null,
    () => repository.getAccountConnections(),
    {
      revalidateOnFocus: false,
    },
  );
