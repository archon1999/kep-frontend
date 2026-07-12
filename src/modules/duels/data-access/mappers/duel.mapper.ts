import { mapProblemDetail } from 'modules/problems/data-access/mappers/problems.mapper.ts';
import {
  Duel,
  DuelInvitation,
  DuelInvitationProblem,
  DuelInvitationUser,
  DuelPlayer,
  DuelPreset,
  DuelPresetProblem,
  DuelTypeInfo,
  DuelProblem,
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
  pinnedRows: ((payload as any)?.pinnedRows ?? (payload as any)?.pinned_rows ?? []).map(
    (item: any) => mapItem(item),
  ),
});

const mapPresetProblem = (payload: any): DuelPresetProblem => ({
  id: payload?.id,
  symbol: payload?.symbol,
  ball: toNullableNumber(payload?.ball),
});

export const mapDuelTypeInfo = (payload: any): DuelTypeInfo => ({
  id: payload?.id,
  code: payload?.code,
  title: payload?.title,
  description: payload?.description,
});

export const mapDuelPreset = (payload: any): DuelPreset => ({
  id: payload?.id,
  type: payload?.type,
  typeInfo: payload?.typeInfo || payload?.type_info ? mapDuelTypeInfo(payload?.typeInfo ?? payload?.type_info ?? {}) : undefined,
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
  displayName: payload?.displayName ?? payload?.display_name,
  isBot: Boolean(payload?.isBot ?? payload?.is_bot ?? false),
  contestsRating: toNullableNumber(payload?.contestsRating ?? payload?.contests_rating),
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
  isLocked: Boolean(payload?.isLocked ?? payload?.is_locked ?? false),
  isClaimed: Boolean(payload?.isClaimed ?? payload?.is_claimed ?? false),
  firstAcceptedAttemptId: toNullableNumber(
    payload?.firstAcceptedAttemptId ?? payload?.first_accepted_attempt_id,
  ),
  unlockAt: payload?.unlockAt ?? payload?.unlock_at ?? null,
  firstAcceptedByUserId: toNullableNumber(
    payload?.firstAcceptedByUserId ?? payload?.first_accepted_by_user_id,
  ),
  firstAcceptedByUsername:
    payload?.firstAcceptedByUsername ?? payload?.first_accepted_by_username ?? null,
  canSubmit: Boolean(payload?.canSubmit ?? payload?.can_submit ?? false),
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
  duelType: payload?.duelType || payload?.duel_type ? mapDuelTypeInfo(payload?.duelType ?? payload?.duel_type ?? {}) : null,
  problems: (payload?.problems ?? []).map(mapDuelProblem),
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
  displayName: payload?.displayName ?? payload?.display_name,
  avatar: payload?.avatar ?? null,
  contestsRating: toNullableNumber(payload?.contestsRating ?? payload?.contests_rating),
  contestsRatingTitle: payload?.contestsRatingTitle ?? payload?.contests_rating_title ?? '',
  isBot: Boolean(payload?.isBot ?? payload?.is_bot ?? false),
});

const mapDuelInvitationProblem = (payload: any): DuelInvitationProblem => ({
  symbol: payload?.symbol ?? '',
  ball: toNullableNumber(payload?.ball),
});

export const mapDuelInvitation = (payload: any): DuelInvitation => ({
  id: toNumber(payload?.id),
  status: toNumber(payload?.status) as DuelInvitation['status'],
  challenger: mapDuelInvitationUser(payload?.challenger ?? {}),
  invitee: payload?.invitee ? mapDuelInvitationUser(payload?.invitee ?? {}) : null,
  otherUser:
    payload?.otherUser || payload?.other_user
      ? mapDuelInvitationUser(payload?.otherUser ?? payload?.other_user ?? {})
      : null,
  preset: payload?.preset ? mapDuelPreset(payload.preset) : null,
  duelType:
    payload?.duelType || payload?.duel_type
      ? mapDuelTypeInfo(payload?.duelType ?? payload?.duel_type ?? {})
      : null,
  proposedStartTime: payload?.proposedStartTime ?? payload?.proposed_start_time ?? null,
  actionRequiredBy:
    payload?.actionRequiredBy || payload?.action_required_by
      ? mapDuelInvitationUser(payload?.actionRequiredBy ?? payload?.action_required_by ?? {})
      : null,
  viewerRole: payload?.viewerRole ?? payload?.viewer_role ?? 'spectator',
  problems: (payload?.problems ?? []).map(mapDuelInvitationProblem),
  duelId: toNullableNumber(payload?.duelId ?? payload?.duel_id),
  isBot: Boolean(payload?.isBot ?? payload?.is_bot ?? false),
  canAccept: Boolean(payload?.canAccept ?? payload?.can_accept ?? false),
  acceptDisabledReason:
    payload?.acceptDisabledReason ?? payload?.accept_disabled_reason ?? null,
  canConfirm: Boolean(payload?.canConfirm ?? payload?.can_confirm ?? false),
  confirmDisabledReason:
    payload?.confirmDisabledReason ?? payload?.confirm_disabled_reason ?? null,
  canCounter: Boolean(payload?.canCounter ?? payload?.can_counter ?? false),
  canReject: Boolean(payload?.canReject ?? payload?.can_reject ?? false),
  canCancel: Boolean(payload?.canCancel ?? payload?.can_cancel ?? false),
  requiresResponse: Boolean(payload?.requiresResponse ?? payload?.requires_response ?? false),
  created: payload?.created,
  updated: payload?.updated,
});

export const duelsMappers = {
  mapPageResult,
  mapDuel,
  mapDuelInvitation,
  mapDuelPreset,
  mapDuelTypeInfo,
  mapDuelResults,
  mapDuelsRatingRow,
};
