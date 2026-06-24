import { arenaApiClient } from '../api/arena.client.ts';
import { mapArenaPlayerStatistics } from '../mappers/arena.mapper.ts';
import { mapPageResult } from '../mappers/page.mapper.ts';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';
import { ArenaStatistics } from '../../domain/entities/arena-statistics.entity.ts';
import { ArenaChallenge } from '../../domain/entities/arena-challenge.entity.ts';
import {
  ArenaHighlight,
  ArenaHighlightKind,
  ArenaHighlightTone,
} from '../../domain/entities/arena-highlight.entity.ts';
import {
  ArenaChallengesFilters,
  ArenaListFilters,
  ArenaPlayersFilters,
  ArenaRepository,
  PageResult,
} from '../../domain/ports/arena.repository.ts';

const mapArena = (data: any): Arena => ({
  id: data?.id ?? 0,
  title: data?.title ?? '',
  status: data?.status as ArenaStatus,
  startTime: data?.startTime ?? data?.start_time ?? '',
  finishTime: data?.finishTime ?? data?.finish_time ?? '',
  startNaturaltime: data?.startNaturaltime ?? data?.start_naturaltime ?? '',
  finishNaturaltime: data?.finishNaturaltime ?? data?.finish_naturaltime ?? '',
  timeSeconds: data?.timeSeconds ?? data?.time_seconds ?? 0,
  questionsCount: data?.questionsCount ?? data?.questions_count ?? 0,
  questionTimeType: data?.questionTimeType ?? data?.question_time_type ?? 1,
  isRegistrated: data?.isRegistrated ?? data?.is_registrated ?? null,
  pause: data?.pause ?? null,
  winner: data?.winner ?? null,
  chapters: data?.chapters ?? [],
});

const mapArenaPlayer = (data: any): ArenaPlayer => ({
  username: data?.username ?? '',
  avatar: data?.avatar ?? undefined,
  rankTitle: data?.rankTitle ?? data?.rank_title ?? '',
  rating: data?.rating ?? 0,
  rank: data?.rank ?? null,
  points: data?.points ?? 0,
  buchholzCoefficient: data?.buchholzCoefficient ?? data?.buchholz_coefficient ?? 0,
  streak: Boolean(data?.streak),
  results: data?.results ?? [],
  isBot: Boolean(data?.isBot ?? data?.is_bot),
});

const mapArenaChallenge = (data: any): ArenaChallenge => {
  const playerFirst = data?.playerFirst ?? data?.player_first ?? {};
  const playerSecond = data?.playerSecond ?? data?.player_second ?? {};

  return {
    ...data,
    finished: data?.finished ?? data?.finished_at ?? null,
    questionsCount: data?.questionsCount ?? data?.questions_count ?? 0,
    timeSeconds: data?.timeSeconds ?? data?.time_seconds ?? 0,
    questionTimeType: data?.questionTimeType ?? data?.question_time_type ?? 1,
    rated: data?.rated ?? data?.is_rated ?? false,
    playerFirst: {
      ...playerFirst,
      username: playerFirst?.username ?? playerFirst?.user_name ?? '',
      avatar: playerFirst?.avatar ?? undefined,
      rankTitle: playerFirst?.rankTitle ?? playerFirst?.rank_title ?? playerFirst?.title ?? '',
      rating: playerFirst?.rating ?? 0,
      result: playerFirst?.result ?? 0,
      results: playerFirst?.results ?? [],
    },
    playerSecond: {
      ...playerSecond,
      username: playerSecond?.username ?? playerSecond?.user_name ?? '',
      avatar: playerSecond?.avatar ?? undefined,
      rankTitle: playerSecond?.rankTitle ?? playerSecond?.rank_title ?? playerSecond?.title ?? '',
      rating: playerSecond?.rating ?? 0,
      result: playerSecond?.result ?? 0,
      results: playerSecond?.results ?? [],
    },
  };
};

const arenaHighlightKinds: ArenaHighlightKind[] = ['achievement', 'fact', 'statistic'];
const arenaHighlightTones: ArenaHighlightTone[] = ['success', 'info', 'warning'];

const isArenaHighlightKind = (value: unknown): value is ArenaHighlightKind =>
  typeof value === 'string' && arenaHighlightKinds.includes(value as ArenaHighlightKind);

const isArenaHighlightTone = (value: unknown): value is ArenaHighlightTone =>
  typeof value === 'string' && arenaHighlightTones.includes(value as ArenaHighlightTone);

const mapArenaHighlight = (data: any): ArenaHighlight => ({
  key: data?.key ?? 'arena_highlight',
  kind: isArenaHighlightKind(data?.kind) ? data.kind : 'fact',
  tone: isArenaHighlightTone(data?.tone) ? data.tone : 'info',
  title: data?.title ?? '',
  message: data?.message ?? '',
});

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

  async unregister(arenaId: number | string): Promise<void> {
    await arenaApiClient.unregister(arenaId);
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
    const data = await arenaApiClient.listPlayers(arenaId, {
      ...filters,
      pin_current_user: filters?.pinCurrentUser ? 'true' : undefined,
    } as any);
    return mapPageResult(data, mapArenaPlayer);
  }

  async listChallenges(
    arenaId: number | string,
    filters?: ArenaChallengesFilters,
  ): Promise<PageResult<ArenaChallenge>> {
    const data = await arenaApiClient.listChallenges(arenaId, filters);
    return mapPageResult(data, mapArenaChallenge);
  }

  async listLiveChallenges(
    arenaId: number | string,
    filters?: ArenaChallengesFilters,
  ): Promise<PageResult<ArenaChallenge>> {
    const data = await arenaApiClient.listLiveChallenges(arenaId, filters);
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
      participants: data?.participants ?? 0,
      averageRating: data?.averageRating ?? data?.average_rating ?? 0,
      challenges: data?.challenges ?? 0,
      longestWinStreak: data?.longestWinStreak ?? data?.longest_win_streak ?? null,
      mostChallengesPlayed: data?.mostChallengesPlayed ?? data?.most_challenges_played ?? null,
      highestPerformance: data?.highestPerformance ?? data?.highest_performance ?? null,
      highestWinRate: data?.highestWinRate ?? data?.highest_win_rate ?? null,
    };
  }

  async getArenaHighlight(arenaId: number | string): Promise<ArenaHighlight> {
    const data = await arenaApiClient.highlight(arenaId);
    return mapArenaHighlight(data);
  }
}
