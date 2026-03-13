import { arenaApiClient } from '../api/arena.client.ts';
import { mapArenaPlayerStatistics } from '../mappers/arena.mapper.ts';
import { mapPageResult } from '../mappers/page.mapper.ts';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';
import { ArenaStatistics } from '../../domain/entities/arena-statistics.entity.ts';
import { ArenaChallenge } from '../../domain/entities/arena-challenge.entity.ts';
import {
  ArenaChallengesFilters,
  ArenaListFilters,
  ArenaPlayersFilters,
  ArenaRepository,
  PageResult,
} from '../../domain/ports/arena.repository.ts';

const mapArena = (data: any): Arena => ({
  ...data,
  status: data?.status as ArenaStatus,
  chapters: data?.chapters ?? [],
});

const mapArenaPlayer = (data: any): ArenaPlayer => ({
  ...data,
  results: data?.results ?? [],
});

const mapArenaChallenge = (data: any): ArenaChallenge => {
  const playerFirst = data?.playerFirst ?? data?.player_first ?? {};
  const playerSecond = data?.playerSecond ?? data?.player_second ?? {};

  return {
    ...data,
    finished: data?.finished ?? data?.finished_at ?? null,
    questionsCount: data?.questionsCount ?? data?.questions_count ?? 0,
    timeSeconds: data?.timeSeconds ?? data?.time_seconds ?? 0,
    rated: data?.rated ?? data?.is_rated ?? false,
    playerFirst: {
      ...playerFirst,
      username: playerFirst?.username ?? playerFirst?.user_name ?? '',
      rankTitle: playerFirst?.rankTitle ?? playerFirst?.rank_title ?? playerFirst?.title ?? '',
      rating: playerFirst?.rating ?? 0,
      result: playerFirst?.result ?? 0,
      results: playerFirst?.results ?? [],
    },
    playerSecond: {
      ...playerSecond,
      username: playerSecond?.username ?? playerSecond?.user_name ?? '',
      rankTitle: playerSecond?.rankTitle ?? playerSecond?.rank_title ?? playerSecond?.title ?? '',
      rating: playerSecond?.rating ?? 0,
      result: playerSecond?.result ?? 0,
      results: playerSecond?.results ?? [],
    },
  };
};

export class HttpArenaRepository implements ArenaRepository {
  async listArenas(filters?: ArenaListFilters): Promise<PageResult<Arena>> {
    const data = await arenaApiClient.list(filters);
    return mapPageResult(data, mapArena);
  }

  async getArena(arenaId: number | string): Promise<Arena> {
    const data = await arenaApiClient.getArena(arenaId);
    return mapArena(data);
  }

  async register(arenaId: number | string): Promise<void> {
    await arenaApiClient.register(arenaId);
  }

  async pause(arenaId: number | string): Promise<void> {
    await arenaApiClient.pause(arenaId);
  }

  async start(arenaId: number | string): Promise<void> {
    await arenaApiClient.start(arenaId);
  }

  async loadNextChallenge(arenaId: number | string): Promise<{ challengeId?: number } | undefined> {
    return arenaApiClient.nextChallenge(arenaId);
  }

  async listPlayers(arenaId: number | string, filters?: ArenaPlayersFilters): Promise<PageResult<ArenaPlayer>> {
    const data = await arenaApiClient.listPlayers(arenaId, filters);
    return mapPageResult(data, mapArenaPlayer);
  }

  async listChallenges(
    arenaId: number | string,
    filters?: ArenaChallengesFilters,
  ): Promise<PageResult<ArenaChallenge>> {
    const data = await arenaApiClient.listChallenges(arenaId, filters);
    return mapPageResult(data, mapArenaChallenge);
  }

  async getPlayerStatistics(arenaId: number | string, username: string): Promise<ArenaPlayerStatistics> {
    const data = await arenaApiClient.playerStatistics(arenaId, username);
    return mapArenaPlayerStatistics(data);
  }

  async getTopPlayers(arenaId: number | string): Promise<ArenaPlayerStatistics[]> {
    const data = await arenaApiClient.topPlayers(arenaId);
    return Array.isArray(data) ? data.map(mapArenaPlayerStatistics) : [];
  }

  async getArenaStatistics(arenaId: number | string): Promise<ArenaStatistics> {
    const data = await arenaApiClient.statistics(arenaId);
    return {
      averageRating: data?.averageRating ?? data?.average_rating ?? 0,
      challenges: data?.challenges ?? 0,
    };
  }
}
