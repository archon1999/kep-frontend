import { Contest, ContestAuthor, ContestsCategory } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  ContestAuthorEntity,
  ContestCategoryEntity,
  ContestListItem,
  ContestTopContestant,
  ContestTopContestantTeamMember,
} from '../../domain/entities/contest.entity';
import { ContestRatingRow } from '../../domain/entities/contest-rating.entity';
import { PageResult } from '../../domain/ports/contests.repository';

const mapAuthor = (payload?: ContestAuthor): ContestAuthorEntity => ({
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? undefined,
});

export const mapContest = (payload: Contest): ContestListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? null,
  status: payload?.status ?? undefined,
  startTime: payload?.startTime ?? undefined,
  finishTime: payload?.finishTime ?? undefined,
  type: payload?.type ?? 'LessCode',
  category: payload?.category ?? 1,
  categoryTitle: payload?.categoryTitle ?? '',
  isRated: payload?.isRated ?? false,
  logo: payload?.logo ?? null,
  contestantsCount: payload?.contestantsCount ?? 0,
  registrantsCount: payload?.registrantsCount ?? 0,
  problemsCount: payload?.problemsCount ?? 0,
  participationType: payload?.participationType ?? 1,
  authors: (payload?.authors ?? []).map(mapAuthor),
});

const mapContestTopContestantTeamMember = (payload: any): ContestTopContestantTeamMember => ({
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? undefined,
});

export const mapContestTopContestant = (payload: any): ContestTopContestant => ({
  username: payload?.username ?? payload?.user?.username ?? '',
  fullName: payload?.userFullName ?? payload?.user?.userFullName ?? undefined,
  ratingTitle: payload?.ratingTitle ?? payload?.user?.ratingTitle ?? undefined,
  country: payload?.country ?? payload?.user?.country ?? undefined,
  teamName: payload?.team?.name ?? undefined,
  teamMembers: (payload?.team?.members ?? []).map(mapContestTopContestantTeamMember),
});

export const mapCategory = (payload: ContestsCategory): ContestCategoryEntity => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  slug: (payload as any)?.slug ?? (payload as any)?.code ?? '',
  icon: (payload as any)?.icon ?? undefined,
  contestsCount: Number((payload as any)?.contestsCount ?? 0),
});

export const mapContestRating = (
  payload: any,
  index: number,
  page: number,
  pageSize: number,
): ContestRatingRow => {
  const baseIndex = Math.max(0, (page - 1) * pageSize);

  return {
    rowIndex: payload?.rowIndex ?? payload?.row_index ?? baseIndex + index + 1,
    username: payload?.username ?? '',
    ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? '',
    rating: payload?.rating ?? payload?.rating_value ?? undefined,
    maxRating: payload?.maxRating ?? payload?.max_rating ?? undefined,
    maxRatingTitle: payload?.maxRatingTitle ?? payload?.max_rating_title ?? undefined,
    contestantsCount: payload?.contestantsCount ?? payload?.contestants_count ?? 0,
  };
};

export const mapPageResult = <T>(
  payload: any,
  mapItem: (item: any, index: number, page: number, pageSize: number) => T,
): PageResult<T> => {
  const page = payload?.page ?? (payload as any)?.current_page ?? 1;
  const pageSize = payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0;
  const data = (payload as any)?.data ?? (payload as any)?.results ?? [];
  const count = payload?.count ?? data.length ?? 0;
  const total = payload?.total ?? payload?.count ?? data.length ?? 0;
  const pagesCount = payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0;

  return {
    page,
    pageSize,
    count,
    total,
    pagesCount,
    data: data.map((item: any, index: number) => mapItem(item, index, page, pageSize)),
  };
};
