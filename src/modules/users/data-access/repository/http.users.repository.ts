import { usersApiClient } from '../api/users.client';
import {
  mapApiUserDetailToDomain,
  mapApiUserRatingsToDomain,
  mapApiUsersListToDomain,
  mapCountriesToCodes,
} from '../mappers/user.mapper';
import { UsersRepository } from '../../domain/ports/users.repository';
import {
  UserDetails,
  UserRatings,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
} from '../../domain/entities/user.entity';

export class HttpUsersRepository implements UsersRepository {
  async getUsers(params: UsersListRequest): Promise<UsersListResponse> {
    const response = await usersApiClient.list({
      // @ts-ignore
      full: true,
      page: params.page,
      page_size: params.pageSize,
      ordering: params.ordering,
      search: params.search,
      country: params.country,
      age_from: params.ageFrom ? String(params.ageFrom) : undefined,
      age_to: params.ageTo ? String(params.ageTo) : undefined,
    });

    return mapApiUsersListToDomain(response);
  }

  async getCountries(): Promise<string[]> {
    const response = await usersApiClient.countries();

    return mapCountriesToCodes(response);
  }

  async getChartStatistics(): Promise<UsersChartStatistics> {
    return usersApiClient.chartStatistics();
  }

  async getUser(username: string): Promise<UserDetails> {
    const response = await usersApiClient.details(username);

    return mapApiUserDetailToDomain(response);
  }

  async getUserRatings(username: string): Promise<UserRatings> {
    const response = await usersApiClient.ratings(username);

    return mapApiUserRatingsToDomain(response);
  }
}
