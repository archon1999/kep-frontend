import type { HomeRepository } from '../../domain/contracts/home.repository';
import type {
  HomeLandingPageStatistics,
  HomeListParams,
  HomeNewsList,
  HomeNextBirthdays,
  HomeOnlineUsers,
  HomePostsList,
  HomePromoSourceItem,
  HomeSystemUpdateLikeResult,
  HomeSystemUpdatesList,
  HomeTopUsers,
  HomeUserActivityHistory,
  HomeUserActivityStatistics,
  HomeUserRatings,
  HomeUsersChart,
} from '../../domain/entities/home.entity';
import { homeApiClient } from '../api/home.client';
import {
  mapBirthdayProfile,
  mapNextBirthdays,
  mapOnlineUsers,
} from '../mappers/home-people.mapper';
import { mapHomePromos } from '../mappers/home-promo.mapper';
import { mapHomeUserRatings } from '../mappers/home-ratings.mapper';

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

  async getNextBirthdays(params?: HomeListParams): Promise<HomeNextBirthdays> {
    const birthdays = mapNextBirthdays(
      await homeApiClient.nextBirthdays({ pageSize: params?.pageSize }),
    );
    const data = await Promise.all(
      birthdays.data.map(async (user) => {
        if (user.dateOfBirth) return user;
        // The birthdays endpoint currently omits the birth year. Use only the
        // date already public on the profile; a failed lookup leaves age hidden.
        try {
          const dateOfBirth = mapBirthdayProfile(
            await homeApiClient.birthdayProfile(user.username),
          );
          return { ...user, dateOfBirth };
        } catch {
          return user;
        }
      }),
    );
    return { data };
  }

  getOnlineUsers(params?: HomeListParams): Promise<HomeOnlineUsers> {
    return homeApiClient.onlineUsers({ pageSize: params?.pageSize }).then(mapOnlineUsers);
  }

  getUsersChart(): Promise<HomeUsersChart> {
    return homeApiClient.usersChart();
  }

  getUserRatings(username: string): Promise<HomeUserRatings> {
    return homeApiClient.userRatings(username).then(mapHomeUserRatings);
  }

  getUserActivityStatistics(): Promise<HomeUserActivityStatistics> {
    return homeApiClient.userActivityStatistics();
  }

  getUserActivityHistory(
    username: string,
    params?: HomeListParams,
  ): Promise<HomeUserActivityHistory> {
    return homeApiClient.userActivityHistory(username, {
      page: params?.page,
      pageSize: params?.pageSize,
    });
  }

  getLandingPageStatistics(): Promise<HomeLandingPageStatistics> {
    return homeApiClient.landingPageStatistics();
  }

  getPromos(): Promise<HomePromoSourceItem[]> {
    return homeApiClient.promos().then(mapHomePromos);
  }

  getSystemUpdates(params?: HomeListParams): Promise<HomeSystemUpdatesList> {
    return homeApiClient.systemUpdates({
      page: params?.page,
      pageSize: params?.pageSize,
    });
  }

  likeSystemUpdate(id: number): Promise<HomeSystemUpdateLikeResult> {
    return homeApiClient.likeSystemUpdate(id);
  }
}
