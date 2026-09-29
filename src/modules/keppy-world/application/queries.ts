import useSWR from 'swr';
import { worldRepository } from '../data-access';
import { worldKeys } from './keys';
export const useWorldBootstrap = (username?: string) => useSWR(
  username ? worldKeys.bootstrap(username) : null, () => worldRepository.bootstrap(),
  { revalidateOnFocus: false, refreshInterval: 30_000, shouldRetryOnError: false },
);
export const useWorldLeaderboard = (period: 'week' | 'all', open: boolean, username?: string) => useSWR(
  open ? worldKeys.leaderboard(period, username) : null, () => worldRepository.leaderboard(period),
  { refreshInterval: 30_000, shouldRetryOnError: false },
);
