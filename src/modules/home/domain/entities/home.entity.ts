import type {
  ApiBlogListResult,
  ApiNewsListResult,
  ApiUserActivityHistoryReadResult,
  ApiUsersChartStatResult,
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
export interface HomeCommunityUser {
  username: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}
export interface HomeNextBirthday extends HomeCommunityUser {
  date?: string;
  dateOfBirth?: string;
}
export interface HomeNextBirthdays {
  data: HomeNextBirthday[];
}
export interface HomeOnlineUsers {
  data: HomeCommunityUser[];
}
export type HomeUsersChart = ApiUsersChartStatResult;
export interface HomeRatingEntry {
  value?: number;
  rank?: number;
  percentile?: number;
  title?: string;
}
export interface HomeUserRatings {
  skillsRating: HomeRatingEntry;
  activityRating: HomeRatingEntry;
  contestsRating: HomeRatingEntry;
  challengesRating: HomeRatingEntry;
}
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
