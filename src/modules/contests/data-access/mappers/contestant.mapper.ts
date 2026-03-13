import { ContestantEntity, ContestantTeam, ContestantTeamMember, ContestFilter } from '../../domain/entities/contestant.entity';
import { ContestRegistrant } from '../../domain/entities/contest-registrant.entity';
import { mapContestProblemInfo } from './contest-problem.mapper';
import { mapPageResult } from './contest.mapper';

const toNumber = (value: any): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapTeamMember = (payload: any): ContestantTeamMember => ({
  username: payload?.username ?? payload?.user ?? '',
  rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? undefined,
  newRating: payload?.newRating !== undefined ? toNumber(payload.newRating) : undefined,
  newRatingTitle: payload?.newRatingTitle ?? payload?.new_rating_title ?? undefined,
});

const mapTeam = (payload: any): ContestantTeam => ({
  name: payload?.name ?? payload?.teamName ?? payload?.title,
  members: (payload?.members ?? payload?.team_members ?? []).map(mapTeamMember),
});

export const mapContestant = (
  payload: any,
  index?: number,
  page?: number,
  pageSize?: number,
): ContestantEntity => {
  const baseIndex =
    index !== undefined && page !== undefined && pageSize !== undefined
      ? Math.max(0, (page - 1) * pageSize)
      : 0;

  return {
    username: payload?.username ?? payload?.user?.username ?? '',
    userFullName:
      payload?.userFullName ??
      payload?.user_full_name ??
      payload?.user?.userFullName ??
      payload?.user?.fullName,
    team: payload?.team ? mapTeam(payload.team) : null,
    type: payload?.type ?? payload?.contestant_type,
    problemsInfo: (payload?.problemsInfo ?? payload?.problems_info ?? []).map(mapContestProblemInfo),
    points: payload?.points !== undefined ? toNumber(payload.points) : undefined,
    penalties: payload?.penalties !== undefined ? toNumber(payload.penalties) : undefined,
    rank: payload?.rank !== undefined ? toNumber(payload.rank) : undefined,
    rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
    ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? payload?.user?.ratingTitle,
    seed: payload?.seed !== undefined ? toNumber(payload.seed) : undefined,
    delta: payload?.delta !== undefined ? toNumber(payload.delta) : undefined,
    bonus: payload?.bonus !== undefined ? toNumber(payload.bonus) : undefined,
    performance:
      payload?.performance !== undefined
        ? toNumber(payload?.performance ?? payload?.perfomance)
        : undefined,
    performanceTitle:
      payload?.performanceTitle ?? payload?.perfomanceTitle ?? payload?.performance_title,
    newRating: payload?.newRating !== undefined ? toNumber(payload?.newRating) : undefined,
    newRatingTitle: payload?.newRatingTitle ?? payload?.new_rating_title ?? undefined,
    doubleRatingPurchased: Boolean(
      payload?.doubleRatingPurchased ?? payload?.double_rating_purchased ?? false,
    ),
    saveRatingPurchased: Boolean(
      payload?.saveRatingPurchased ?? payload?.save_rating_purchased ?? false,
    ),
    isVirtual: payload?.isVirtual ?? payload?.virtual ?? false,
    isUnrated: payload?.isUnrated ?? payload?.unrated ?? false,
    isOfficial:
      payload?.isOfficial !== undefined ? Boolean(payload?.isOfficial) : payload?.official ?? undefined,
    virtualTime: payload?.virtualTime ?? payload?.virtual_time ?? null,
    country: payload?.country ?? payload?.user?.country ?? undefined,
    rowIndex:
      payload?.rowIndex ??
      payload?.row_index ??
      (index !== undefined && page !== undefined && pageSize !== undefined
        ? baseIndex + index + 1
        : undefined),
  };
};

export const mapContestantsPage = (payload: any) =>
  mapPageResult(payload, (item: any, index: number, page: number, pageSize: number) =>
    mapContestant(item, index, page, pageSize),
  );

export const mapContestantList = (payload: any[]): ContestantEntity[] =>
  (payload ?? []).map((item: any, index: number) => mapContestant(item, index));

export const mapContestFilter = (payload: any): ContestFilter => ({
  id: payload?.id ?? payload?.value ?? payload,
  name: payload?.name ?? payload?.label ?? String(payload?.id ?? payload ?? ''),
});

export const mapContestFilters = (payload: any): ContestFilter[] => {
  const list = Array.isArray(payload) ? payload : (payload as any)?.filters;
  if (!Array.isArray(list)) return [];
  return list.map(mapContestFilter);
};

export const mapContestRegistrant = (
  payload: any,
  index?: number,
  page?: number,
  pageSize?: number,
): ContestRegistrant => {
  const baseIndex =
    index !== undefined && page !== undefined && pageSize !== undefined
      ? Math.max(0, (page - 1) * pageSize)
      : 0;

  return {
    username: payload?.username ?? '',
    rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
    ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? undefined,
    team: payload?.team ? mapTeam(payload.team) : null,
    rowIndex:
      payload?.rowIndex ??
      payload?.row_index ??
      (index !== undefined && page !== undefined && pageSize !== undefined
        ? baseIndex + index + 1
        : undefined),
  };
};
