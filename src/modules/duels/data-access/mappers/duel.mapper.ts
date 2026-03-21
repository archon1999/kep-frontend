import { mapProblemDetail } from 'modules/problems/data-access/mappers/problems.mapper.ts';
import {
  Duel,
  DuelInvitation,
  DuelInvitationProblem,
  DuelInvitationUser,
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
  penalty: toNullableNumber(payload?.penalty),
});

export const mapDuelProblem = (payload: any): DuelProblem => ({
  symbol: payload?.symbol ?? payload?.problemSymbol ?? '',
  ball: toNullableNumber(payload?.ball ?? payload?.score),
  playerFirstBall: toNullableNumber(payload?.playerFirstBall ?? payload?.player_first_ball),
  playerSecondBall: toNullableNumber(payload?.playerSecondBall ?? payload?.player_second_ball),
  problem:
    payload?.problem || payload?.problem_detail
      ? mapProblemDetail(payload?.problem ?? payload?.problem_detail)
      : undefined,
});

export const mapDuel = (payload: any): Duel => ({
  id: toNumber(payload?.id),
  startTime: payload?.startTime ?? payload?.start_time ?? null,
  finishTime: payload?.finishTime ?? payload?.finish_time ?? null,
  status: (payload?.status ?? payload?.state ?? -1) as Duel['status'],
  isPlayer: Boolean(payload?.isPlayer ?? payload?.is_player ?? payload?.is_current_player),
  isConfirmed: payload?.isConfirmed ?? payload?.is_confirmed ?? undefined,
  viewerRole: payload?.viewerRole ?? payload?.viewer_role ?? 'spectator',
  canSubmitForDuel: Boolean(payload?.canSubmitForDuel ?? payload?.can_submit_for_duel ?? false),
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
  contestsRating: toNullableNumber(payload?.contestsRating ?? payload?.contests_rating),
  contestsRatingTitle: payload?.contestsRatingTitle ?? payload?.contests_rating_title ?? '',
});

export const mapReadyStatus = (payload: any): DuelReadyStatus => ({
  ready: Boolean(payload?.ready ?? payload?.isReady ?? payload?.is_ready ?? payload?.is_ready_for_duel ?? false),
  readyUntil: payload?.readyUntil ?? payload?.ready_until ?? payload?.duelReadyUntil ?? payload?.duel_ready_until ?? null,
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
    contestsRating: toNullableNumber(
      payload?.user?.contestsRating
        ?? payload?.user?.contests_rating
        ?? payload?.contestsRating
        ?? payload?.contests_rating,
    ),
    contestsRatingTitle:
      payload?.user?.contestsRatingTitle
      ?? payload?.user?.contests_rating_title
      ?? payload?.contestsRatingTitle
      ?? payload?.contests_rating_title
      ?? '',
  },
  duels: toNullableNumber(payload?.duels ?? payload?.count),
  wins: toNullableNumber(payload?.wins),
  draws: toNullableNumber(payload?.draws),
  losses: toNullableNumber(payload?.losses),
});

const mapDuelInvitationUser = (payload: any): DuelInvitationUser => ({
  id: toNullableNumber(payload?.id),
  username: payload?.username ?? '',
});

const mapDuelInvitationProblem = (payload: any): DuelInvitationProblem => ({
  symbol: payload?.symbol ?? '',
  ball: toNullableNumber(payload?.ball),
});

export const mapDuelInvitation = (payload: any): DuelInvitation => ({
  id: toNumber(payload?.id),
  status: toNumber(payload?.status) as DuelInvitation['status'],
  challenger: mapDuelInvitationUser(payload?.challenger ?? {}),
  invitee: mapDuelInvitationUser(payload?.invitee ?? {}),
  otherUser:
    payload?.otherUser || payload?.other_user
      ? mapDuelInvitationUser(payload?.otherUser ?? payload?.other_user ?? {})
      : null,
  preset: payload?.preset ? mapDuelPreset(payload.preset) : null,
  proposedStartTime: payload?.proposedStartTime ?? payload?.proposed_start_time ?? null,
  actionRequiredBy:
    payload?.actionRequiredBy || payload?.action_required_by
      ? mapDuelInvitationUser(payload?.actionRequiredBy ?? payload?.action_required_by ?? {})
      : null,
  viewerRole: payload?.viewerRole ?? payload?.viewer_role ?? 'spectator',
  problems: (payload?.problems ?? []).map(mapDuelInvitationProblem),
  duelId: toNullableNumber(payload?.duelId ?? payload?.duel_id),
  canAccept: Boolean(payload?.canAccept ?? payload?.can_accept ?? false),
  canCounter: Boolean(payload?.canCounter ?? payload?.can_counter ?? false),
  canReject: Boolean(payload?.canReject ?? payload?.can_reject ?? false),
  requiresResponse: Boolean(payload?.requiresResponse ?? payload?.requires_response ?? false),
  created: payload?.created,
  updated: payload?.updated,
});

export const duelsMappers = {
  mapPageResult,
  mapDuel,
  mapDuelInvitation,
  mapReadyPlayer,
  mapReadyStatus,
  mapDuelPreset,
  mapDuelResults,
  mapDuelsRatingRow,
};
