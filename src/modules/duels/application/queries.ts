import useSWR from 'swr';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import { DuelsListParams } from '../domain/ports/duels.repository.ts';
import {
  Duel,
  DuelPreset,
  DuelReadyPlayer,
  DuelReadyStatus,
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

export const useDuelsRating = (params?: { page?: number; pageSize?: number; ordering?: string }) =>
  useSWR<PageResult<DuelsRatingRow>>(
    ['duels-rating', params?.page, params?.pageSize, params?.ordering],
    () => duelsRepository.getDuelsRating(params),
  );

export const useReadyStatus = () =>
  useSWR<DuelReadyStatus>('duels-ready-status', () => duelsRepository.getReadyStatus(), {
    revalidateOnFocus: false,
  });

export const useReadyPlayers = (params?: { page?: number; pageSize?: number }) =>
  useSWR<PageResult<DuelReadyPlayer>>(
    ['duels-ready-players', params?.page, params?.pageSize],
    () => duelsRepository.getReadyPlayers(params),
  );

export const useDuelPresets = (username?: string | null) =>
  useSWR<DuelPreset[]>(username ? ['duel-presets', username] : null, () =>
    duelsRepository.getDuelPresets(username ?? ''),
  );

export const useDuelDetail = (id?: number | string) =>
  useSWR<Duel | null>(id ? ['duel-detail', id] : null, () => duelsRepository.getDuel(id!), {
    revalidateOnFocus: false,
  });

export const useDuelResults = (id?: number | string) =>
  useSWR<DuelResults | null>(id ? ['duel-results', id] : null, () => duelsRepository.getDuelResults(id!), {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

export const duelsQueries = {
  duelsRepository,
};
