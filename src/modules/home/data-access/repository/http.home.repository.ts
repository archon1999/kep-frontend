import { homeApiClient } from '../api/home.client';
import type { HomeRepository } from '../../domain/ports/home.repository';
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
} from '../../domain/entities/home.entity';

export class HttpHomeRepository implements HomeRepository {
  getNews(params?: HomeListParams): Promise<HomeNewsList> {
    return homeApiClient.news({ pageSize: params?.pageSize });
  }

  getPosts(params?: HomeListParams): Promise<HomePostsList> {
    return homeApiClient.posts({ pageSize: params?.pageSize, not_news: '1' });
  }

  getTopUsers(params?: HomeListParams): Promise<HomeTopUsers> {
    return homeApiClient.topUsers({ pageSize: params?.pageSize });
  }

  getNextBirthdays(params?: HomeListParams): Promise<HomeNextBirthdays> {
    return homeApiClient.nextBirthdays({ pageSize: params?.pageSize });
  }

  getOnlineUsers(params?: HomeListParams): Promise<HomeOnlineUsers> {
    return homeApiClient.onlineUsers({ pageSize: params?.pageSize });
  }

  getUsersChart(): Promise<HomeUsersChart> {
    return homeApiClient.usersChart();
  }

  getUserRatings(username: string): Promise<HomeUserRatings> {
    return homeApiClient.userRatings(username);
  }

  getUserActivityStatistics(): Promise<HomeUserActivityStatistics> {
    return homeApiClient.userActivityStatistics();
  }

  getUserActivityHistory(username: string, params?: HomeListParams): Promise<HomeUserActivityHistory> {
    return homeApiClient.userActivityHistory(username, {
      page: params?.page,
      pageSize: params?.pageSize,
    });
  }

  getLandingPageStatistics(): Promise<HomeLandingPageStatistics> {
    return homeApiClient.landingPageStatistics();
  }
}
