import type {
  ApiBlogListResult,
  ApiNewsListResult,
  ApiUserActivityHistoryReadResult,
  ApiUsersChartStatResult,
  ApiUsersNextBirthdaysResult,
  ApiUsersOnlineResult,
  ApiUsersRatingsResult,
  ApiUsersTopRatingResult,
} from 'shared/api/orval/generated/endpoints';

export interface HomeUserActivityStat {
  series: number[];
  total: number;
  diff: number;
  percentage: number;
}

export interface HomeUserActivityStatistics {
  newUsers: HomeUserActivityStat;
  activeUsers: HomeUserActivityStat;
}
export type HomeStatisticKey = 'users' | 'problems' | 'competitions' | 'attempts';

export type HomeStatisticEntry = {
  value: number;
  percent: number;
  difference: number;
};

export type HomeLandingPageStatistics = Record<HomeStatisticKey, HomeStatisticEntry>;

export type HomeNewsList = ApiNewsListResult;
export type HomePostsList = ApiBlogListResult;
export type HomeTopUsers = ApiUsersTopRatingResult;
export type HomeNextBirthdays = ApiUsersNextBirthdaysResult;
export type HomeOnlineUsers = ApiUsersOnlineResult;
export type HomeUsersChart = ApiUsersChartStatResult;
export type HomeUserRatings = ApiUsersRatingsResult;
export type HomeUserActivityHistory = ApiUserActivityHistoryReadResult;
export type HomeUserActivityHistoryItem = HomeUserActivityHistory['data'][number];

export interface HomeListParams {
  pageSize?: number;
  page?: number;
}

export interface HomePageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface HomeSystemUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  updateType: 'new' | 'update';
  image: string | null;
  likesCount: number;
  isLiked: boolean;
}

export type HomeSystemUpdatesList = HomePageResult<HomeSystemUpdate>;

export interface HomeSystemUpdateLikeResult {
  likesCount: number;
  isLiked: boolean;
}

export * from './home-promo.entity';
