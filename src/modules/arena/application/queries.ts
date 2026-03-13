import useSWR from 'swr';
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

export const useArenaDetails = (arenaId?: string | number) =>
  useSWR<Arena>(arenaId ? ['arena-details', arenaId] : null, () => arenaRepository.getArena(arenaId!));

export const useArenaPlayers = (arenaId?: string | number, filters?: ArenaPlayersFilters) =>
  useSWR(arenaId ? ['arena-players', arenaId, filters] : null, () => arenaRepository.listPlayers(arenaId!, filters), {
    keepPreviousData: true,
  });

export const useArenaChallenges = (arenaId?: string | number, filters?: ArenaChallengesFilters) =>
  useSWR(
    arenaId ? ['arena-challenges', arenaId, filters] : null,
    () => arenaRepository.listChallenges(arenaId!, filters),
    {
      keepPreviousData: true,
    },
  );

export const useArenaPlayerStatistics = (arenaId?: string | number, username?: string) =>
  useSWR<ArenaPlayerStatistics>(
    arenaId && username ? ['arena-player-statistics', arenaId, username] : null,
    () => arenaRepository.getPlayerStatistics(arenaId!, username!),
  );

export const useArenaTopPlayers = (arenaId?: string | number) =>
  useSWR<ArenaPlayerStatistics[]>(arenaId ? ['arena-top', arenaId] : null, () => arenaRepository.getTopPlayers(arenaId!));

export const useArenaStatistics = (arenaId?: string | number) =>
  useSWR<ArenaStatistics>(arenaId ? ['arena-statistics', arenaId] : null, () => arenaRepository.getArenaStatistics(arenaId!));

export const arenaQueries = {
  arenaRepository,
};
