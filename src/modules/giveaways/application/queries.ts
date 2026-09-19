import useSWR from 'swr';
import { giveawaysRepository } from '../data-access/repository/giveaways.repository.impl';
import type { Giveaway } from '../domain/entities/giveaway.types';
import { giveawayKeys } from './keys';

// Keep this callback stable: countdown renders must not restart SWR's polling timer.
const refreshGiveawayInterval = (data?: Giveaway) => (data?.status === 'finished' ? 0 : 2000);

export const useGiveaway = (id: string, username: string) =>
  useSWR(giveawayKeys.detail(id, username), () => giveawaysRepository.get(id), {
    refreshInterval: refreshGiveawayInterval,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryInterval: 3000,
    dedupingInterval: 500,
  });

export const useLinkedGiveaways = (
  source: 'contest' | 'arena',
  id?: string | number,
  username?: string,
) =>
  useSWR(id && username ? giveawayKeys.list(source, id, username) : null, () =>
    giveawaysRepository.list(source, id!),
  );
