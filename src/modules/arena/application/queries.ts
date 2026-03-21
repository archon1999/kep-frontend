import useSWR from 'swr';
import type { SWRConfiguration } from 'swr';
import { HttpArenaRepository } from '../data-access/repository/http.arena.repository.ts';
import {
  ArenaChallengesFilters,
  ArenaListFilters,
  ArenaPlayersFilters,
  ArenaRepository,
} from '../domain/ports/arena.repository.ts';
import { Arena } from '../domain/entities/arena.entity.ts';
import { ArenaPlayerStatistics } from '../domain/entities/arena-player-statistics.entity.ts';
import { ArenaStatistics } from '../domain/entities/arena-statistics.entity.ts';

const arenaRepository: ArenaRepository = new HttpArenaRepository();

export const useArenasList = (filters?: ArenaListFilters) =>
  useSWR(filters ? ['arena-list', filters] : ['arena-list'], () => arenaRepository.listArenas(filters), {
    keepPreviousData: true,
  });

export const useArenaDetails = (arenaId?: string | number, options?: SWRConfiguration) =>
  useSWR<Arena>(
    arenaId ? ['arena-details', arenaId] : null,
    () => arenaRepository.getArena(arenaId!),
    options,
  );

export const useArenaPlayers = (
  arenaId?: string | number,
  filters?: ArenaPlayersFilters,
  options?: SWRConfiguration,
) =>
  useSWR(arenaId ? ['arena-players', arenaId, filters] : null, () => arenaRepository.listPlayers(arenaId!, filters), {
    keepPreviousData: true,
    ...options,
  });

export const useArenaChallenges = (
  arenaId?: string | number,
  filters?: ArenaChallengesFilters,
  options?: SWRConfiguration,
) =>
  useSWR(
    arenaId ? ['arena-challenges', arenaId, filters] : null,
    () => arenaRepository.listChallenges(arenaId!, filters),
    {
      keepPreviousData: true,
      ...options,
    },
  );

export const useArenaPlayerStatistics = (arenaId?: string | number, username?: string) =>
  useSWR<ArenaPlayerStatistics>(
    arenaId && username ? ['arena-player-statistics', arenaId, username] : null,
    () => arenaRepository.getPlayerStatistics(arenaId!, username!),
  );

export const useArenaTopPlayers = (arenaId?: string | number, options?: SWRConfiguration) =>
  useSWR<ArenaPlayerStatistics[]>(
    arenaId ? ['arena-top', arenaId] : null,
    () => arenaRepository.getTopPlayers(arenaId!),
    options,
  );

export const useArenaStatistics = (
  arenaId?: string | number,
  options?: SWRConfiguration,
) =>
  useSWR<ArenaStatistics>(
    arenaId ? ['arena-statistics', arenaId] : null,
    () => arenaRepository.getArenaStatistics(arenaId!),
    options,
  );

export const useArenaNextChallenge = (arenaId?: string | number, enabled = false) =>
  useSWR(
    arenaId && enabled ? ['arena-next-challenge', arenaId] : null,
    () => arenaRepository.loadNextChallenge(arenaId!),
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    },
  );

export const arenaQueries = {
  arenaRepository,
};
