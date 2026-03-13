import {
  Duel,
  DuelPlayer,
  DuelPreset,
  DuelPresetProblem,
  DuelPresetTypeInfo,
  DuelProblem,
  DuelReadyPlayer,
  DuelReadyStatus,
  DuelResults,
  DuelsRatingRow,
} from '../../domain/index.ts';
import { PageResult } from '../../domain/ports/duels.repository.ts';

const toNumber = (value: any) => (typeof value === 'number' ? value : Number(value) || 0);
const toNullableNumber = (value: any) =>
  value === null || value === undefined || value === '' ? undefined : toNumber(value);

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? payload?.current_page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.results?.length ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.results?.length ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.total_pages ?? payload?.pages_count ?? 0,
  data: (payload?.data ?? payload?.results ?? []).map(mapItem),
});

const mapPresetProblem = (payload: any): DuelPresetProblem => ({
  id: payload?.id,
  symbol: payload?.symbol,
  ball: toNullableNumber(payload?.ball),
});

const mapPresetTypeInfo = (payload: any): DuelPresetTypeInfo => ({
  id: payload?.id,
  code: payload?.code,
  title: payload?.title,
  description: payload?.description,
});

export const mapDuelPreset = (payload: any): DuelPreset => ({
  id: payload?.id,
  type: payload?.type,
  typeInfo: mapPresetTypeInfo(payload?.typeInfo ?? payload?.type_info ?? {}),
  difficulty: toNullableNumber(payload?.difficulty),
  difficultyDisplay: payload?.difficultyDisplay ?? payload?.difficulty_display,
  title: payload?.title,
  description: payload?.description,
  duration: payload?.duration,
  category: payload?.category,
  problemsCount: toNullableNumber(payload?.problemsCount ?? payload?.problems_count),
  problems: (payload?.problems ?? []).map(mapPresetProblem),
});

export const mapDuelPlayer = (payload: any): DuelPlayer => ({
  id: toNumber(payload?.id),
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? '',
  status: (payload?.status ?? payload?.playerStatus ?? null) as DuelPlayer['status'],
  balls: toNullableNumber(payload?.balls ?? payload?.score),
});

export const mapDuelProblem = (payload: any): DuelProblem => ({
  symbol: payload?.symbol ?? payload?.problemSymbol ?? '',
  ball: toNullableNumber(payload?.ball ?? payload?.score),
  playerFirstBall: toNullableNumber(payload?.playerFirstBall ?? payload?.player_first_ball),
  playerSecondBall: toNullableNumber(payload?.playerSecondBall ?? payload?.player_second_ball),
  problem: (payload?.problem ?? payload?.problem_detail) as any,
});

export const mapDuel = (payload: any): Duel => ({
  id: toNumber(payload?.id),
  startTime: payload?.startTime ?? payload?.start_time ?? null,
  finishTime: payload?.finishTime ?? payload?.finish_time ?? null,
  status: (payload?.status ?? payload?.state ?? -1) as Duel['status'],
  isPlayer: Boolean(payload?.isPlayer ?? payload?.is_player ?? payload?.is_current_player),
  isConfirmed: payload?.isConfirmed ?? payload?.is_confirmed ?? undefined,
  playerFirst: mapDuelPlayer(payload?.playerFirst ?? payload?.player_first ?? {}),
  playerSecond: payload?.playerSecond || payload?.player_second ? mapDuelPlayer(payload?.playerSecond ?? payload?.player_second ?? {}) : null,
  preset: payload?.preset || payload?.duelPreset ? mapDuelPreset(payload?.preset ?? payload?.duelPreset ?? {}) : null,
  problems: (payload?.problems ?? []).map(mapDuelProblem),
});

export const mapReadyPlayer = (payload: any): DuelReadyPlayer => ({
  username: payload?.username ?? '',
  fullName: payload?.fullName ?? payload?.full_name ?? '',
  avatar: payload?.avatar ?? '',
  wins: toNullableNumber(payload?.wins),
  draws: toNullableNumber(payload?.draws),
  losses: toNullableNumber(payload?.losses),
});

export const mapReadyStatus = (payload: any): DuelReadyStatus => ({
  ready: Boolean(payload?.ready ?? payload?.isReady ?? payload?.is_ready ?? false),
});

export const mapDuelResults = (payload: any): DuelResults => ({
  playerFirst: payload?.playerFirst ?? payload?.player_first ?? [],
  playerSecond: payload?.playerSecond ?? payload?.player_second ?? [],
});

export const mapDuelsRatingRow = (payload: any): DuelsRatingRow => ({
  rowIndex: payload?.rowIndex ?? payload?.row_index ?? payload?.place,
  user: {
    username: payload?.user?.username ?? payload?.username ?? '',
    avatar: payload?.user?.avatar ?? payload?.avatar ?? '',
  },
  duels: toNullableNumber(payload?.duels ?? payload?.count),
  wins: toNullableNumber(payload?.wins),
  draws: toNullableNumber(payload?.draws),
  losses: toNullableNumber(payload?.losses),
});

export const duelsMappers = {
  mapPageResult,
  mapDuel,
  mapReadyPlayer,
  mapReadyStatus,
  mapDuelPreset,
  mapDuelResults,
  mapDuelsRatingRow,
};
