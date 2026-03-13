import type {
  HomeListParams,
  HomeNewsList,
  HomeNextBirthdays,
  HomeOnlineUsers,
  HomePostsList,
  HomeLandingPageStatistics,
  HomeTopUsers,
  HomeUserActivityStatistics,
  HomeUserActivityHistory,
  HomeUserRatings,
  HomeUsersChart,
} from '../entities/home.entity';

export interface HomeRepository {
  getNews: (params?: HomeListParams) => Promise<HomeNewsList>;
  getPosts: (params?: HomeListParams) => Promise<HomePostsList>;
  getTopUsers: (params?: HomeListParams) => Promise<HomeTopUsers>;
  getNextBirthdays: (params?: HomeListParams) => Promise<HomeNextBirthdays>;
  getOnlineUsers: (params?: HomeListParams) => Promise<HomeOnlineUsers>;
  getUsersChart: () => Promise<HomeUsersChart>;
  getUserRatings: (username: string) => Promise<HomeUserRatings>;
  getUserActivityStatistics: () => Promise<HomeUserActivityStatistics>;
  getUserActivityHistory: (username: string, params?: HomeListParams) => Promise<HomeUserActivityHistory>;
  getLandingPageStatistics: () => Promise<HomeLandingPageStatistics>;
}
