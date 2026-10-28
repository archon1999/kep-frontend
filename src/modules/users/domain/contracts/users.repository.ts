import {
  UserDetails,
  UserRatings,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
} from '../entities/user.entity';

export interface UsersRepository {
  setFollowing: (username: string, following: boolean) => Promise<void>;
  getUsers: (params: UsersListRequest) => Promise<UsersListResponse>;
  getCountries: () => Promise<string[]>;
  getChartStatistics: () => Promise<UsersChartStatistics>;
  getUser: (username: string) => Promise<UserDetails>;
  getUserRatings: (username: string) => Promise<UserRatings>;
}
