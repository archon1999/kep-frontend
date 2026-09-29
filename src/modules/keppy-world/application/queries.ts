import useSWR from 'swr';
import { worldRepository } from '../data-access';
import { worldKeys } from './keys';

export const useWorldBootstrap = (username?: string) =>
  useSWR(username ? worldKeys.bootstrap(username) : null, () => worldRepository.bootstrap(), {
    revalidateOnFocus: false,
    refreshInterval: 30_000,
    shouldRetryOnError: false,
  });
export const useWorldLeaderboard = (
  period: 'week' | 'all',
  open: boolean,
  username?: string,
  page = 1,
) =>
  useSWR(
    open ? worldKeys.leaderboard(period, username, page) : null,
    () => worldRepository.leaderboard(period, page),
    { refreshInterval: 30_000, shouldRetryOnError: false },
  );
