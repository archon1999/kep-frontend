import { apiClient } from 'shared/api';
import type { ApiUsersCountriesResult, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';
import type { ApiUsersListParams, UserDetail } from 'shared/api/orval/generated/endpoints/index.schemas';
import { axiosMutator } from 'shared/api/http/axiosMutator.ts';
import { instance } from 'shared/api/http/axiosInstance.ts';


interface UsersChartStatisticsApiResponse {
  total: number;
  series: number[];
}

export interface UserRatingsApiResponse {
  skillsRating?: RatingInfoApiResponse;
  activityRating?: RatingInfoApiResponse;
  contestsRating?: RatingInfoApiResponse;
  challengesRating?: RatingInfoApiResponse;
  skills_rating?: RatingInfoApiResponse;
  activity_rating?: RatingInfoApiResponse;
  contests_rating?: RatingInfoApiResponse;
  challenges_rating?: RatingInfoApiResponse;
}

export interface RatingInfoApiResponse {
  value?: number | string;
  rank?: number;
  percentile?: number;
  title?: string;
}

export const usersApiClient = {
  list: (params?: ApiUsersListParams) =>
    apiClient.apiUsersList(params) as Promise<ApiUsersListResult>,
  countries: () => apiClient.apiUsersCountries() as Promise<ApiUsersCountriesResult>,
  chartStatistics: () =>
    apiClient.apiUsersChartStat() as unknown as Promise<UsersChartStatisticsApiResponse>,
  details: (username: string) => apiClient.apiUsersRead(username) as Promise<UserDetail>,
  ratings: (username: string) =>
    apiClient.apiUsersRatings(username) as unknown as Promise<UserRatingsApiResponse>,
  generalInfo: (username: string) => apiClient.apiUsersGeneralInfoRead(username) as Promise<any>,
  profileInfo: (username: string) => apiClient.apiUsersInfoRead(username) as Promise<any>,
  social: (username: string) => apiClient.apiUsersSocialRead(username) as Promise<any>,
  skills: (username: string) => apiClient.apiUsersSkillsRead(username) as Promise<any>,
  technologies: (username: string) => apiClient.apiUsersTechnologiesRead(username) as Promise<any>,
  educations: (username: string) => apiClient.apiUsersEducationsRead(username) as Promise<any>,
  workExperiences: (username: string) => apiClient.apiUsersWorkExperiencesRead(username) as Promise<any>,
  achievements: (username: string) => apiClient.apiUsersAchievements(username) as Promise<any>,
  competitionPrizes: (username: string) =>
    apiClient.apiUsersCompetitionPrizes(username) as Promise<any>,
  followers: (username: string, params?: { page?: number; pageSize?: number }) =>
    apiClient.apiUsersFollowersList(username, {
      page: params?.page,
      pageSize: params?.pageSize,
    }) as Promise<any>,
  activityHistory: (username: string, params?: { page?: number; pageSize?: number }) =>
    apiClient.apiUserActivityHistoryRead(username, params) as Promise<any>,
  follow: (username: string) => axiosMutator<void>({ url: `/api/users/${username}/follow/`, method: 'POST' }),
  unfollow: (username: string) => instance.delete(`/api/users/${username}/follow/`).then((res) => res.data),
};
