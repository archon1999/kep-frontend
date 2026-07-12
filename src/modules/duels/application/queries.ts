import useSWR from 'swr';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import { DuelCallsParams, DuelsListParams, DuelsRatingParams } from '../domain/ports/duels.repository.ts';
import {
  Duel,
  DuelInvitation,
  DuelPreset,
  DuelTypeInfo,
  DuelResults,
  DuelsRatingRow,
} from '../domain/index.ts';
import { PageResult } from '../domain/ports/duels.repository.ts';

const duelsRepository = new HttpDuelsRepository();

export const useDuelsList = (
  params?: DuelsListParams & { my?: boolean },
) =>
  useSWR<PageResult<Duel>>(
    params?.my ? ['duels-my', params?.page, params?.pageSize, params?.ordering] : ['duels-list', params?.page, params?.pageSize, params?.username, params?.ordering],
    () => (params?.my ? duelsRepository.getMyDuels(params) : duelsRepository.getDuels(params)),
  );

export const useDuelsRating = (params?: DuelsRatingParams) =>
  useSWR<PageResult<DuelsRatingRow>>(
    ['duels-rating', params?.page, params?.pageSize, params?.ordering, params?.pinCurrentUser],
    () => duelsRepository.getDuelsRating(params),
  );

export const useDuelPresets = (enabled = true) =>
  useSWR<DuelPreset[]>(enabled ? 'duel-presets' : null, () =>
    duelsRepository.getDuelPresets(),
  );

export const useDuelTypes = (enabled = true) =>
  useSWR<DuelTypeInfo[]>(enabled ? 'duel-types' : null, () =>
    duelsRepository.getDuelTypes(),
  );

export const useDuelCalls = (params?: DuelCallsParams) =>
  useSWR<PageResult<DuelInvitation>>(
    ['duel-calls', params?.scope, params?.page, params?.pageSize],
    () => duelsRepository.getDuelCalls(params),
  );

export const isDuelsCollectionCacheKey = (key: unknown) =>
  Array.isArray(key) &&
  ['duel-calls', 'duels-my', 'duels-list'].includes(String(key[0]));

export const useDuelDetail = (id?: number | string) =>
  useSWR<Duel | null>(id ? ['duel-detail', id] : null, () => duelsRepository.getDuel(id!), {
    revalidateOnFocus: false,
    refreshInterval: 15000,
  });

export const useDuelResults = (id?: number | string) =>
  useSWR<DuelResults | null>(id ? ['duel-results', id] : null, () => duelsRepository.getDuelResults(id!), {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

export const duelsQueries = {
  duelsRepository,
};
