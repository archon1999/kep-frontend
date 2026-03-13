import { apiClient } from 'shared/api';
import { axiosMutator } from 'shared/api/http/axiosMutator';
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
import type {
  ApiBlogListParams,
  ApiNewsListParams,
  ApiUserActivityHistoryReadParams,
  ApiUsersChartStatParams,
  ApiUsersNextBirthdaysParams,
  ApiUsersOnlineParams,
  ApiUsersTopRatingParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import type { HomeUserActivityStatistics } from '../../domain/entities/home.entity';
import type { HomeLandingPageStatistics } from '../../domain/entities/home.entity.ts';

export const homeApiClient = {
  news: (params?: ApiNewsListParams) => apiClient.apiNewsList(params) as Promise<ApiNewsListResult>,
  posts: (params?: ApiBlogListParams) => apiClient.apiBlogList(params) as Promise<ApiBlogListResult>,
  topUsers: (params?: ApiUsersTopRatingParams) => apiClient.apiUsersTopRating(params) as Promise<ApiUsersTopRatingResult>,
  nextBirthdays: (params?: ApiUsersNextBirthdaysParams) =>
    apiClient.apiUsersNextBirthdays(params) as Promise<ApiUsersNextBirthdaysResult>,
  onlineUsers: (params?: ApiUsersOnlineParams) => apiClient.apiUsersOnline(params) as Promise<ApiUsersOnlineResult>,
  usersChart: (params?: ApiUsersChartStatParams) =>
    apiClient.apiUsersChartStat(params) as Promise<ApiUsersChartStatResult>,
  userRatings: (username: string) => apiClient.apiUsersRatings(username) as Promise<ApiUsersRatingsResult>,
  userActivityHistory: (username: string, params?: ApiUserActivityHistoryReadParams) =>
    apiClient.apiUserActivityHistoryRead(username, params) as Promise<ApiUserActivityHistoryReadResult>,
  userActivityStatistics: () =>
    axiosMutator<HomeUserActivityStatistics>({ url: '/api/users/user-activity-statistics/', method: 'GET' }),
  landingPageStatistics: () =>
    apiClient.apiLandingPageStatisticsList() as unknown as Promise<HomeLandingPageStatistics>,
};
