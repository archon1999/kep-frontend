import useSWR from 'swr';
import { HttpUsersRepository } from '../data-access/repository/http.users.repository';
import { HttpUserProfileRepository } from '../data-access/repository/http.user-profile.repository';
import {
  UserAchievement,
  UserCompetitionPrize,
  UserFollowersPreview,
  UserProfileAbout,
  UserSocialLinks,
} from '../domain/entities/user-profile.entity';
import {
  UserDetails,
  UserRatings,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
} from '../domain/entities/user.entity';

const repository = new HttpUsersRepository();
const profileRepository = new HttpUserProfileRepository();

export const useUsersList = (params: UsersListRequest) =>
  useSWR<UsersListResponse>(['users-list', params], () => repository.getUsers(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUsersCountries = () =>
  useSWR<string[]>(['users-countries'], () => repository.getCountries(), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUsersChartStatistics = () =>
  useSWR<UsersChartStatistics>(['users-chart-statistics'], () => repository.getChartStatistics(), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserDetails = (username?: string | null) =>
  useSWR<UserDetails>(username ? ['user-details', username] : null, () => repository.getUser(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserRatings = (username?: string | null) =>
  useSWR<UserRatings>(username ? ['user-ratings', username] : null, () => repository.getUserRatings(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserAbout = (username?: string | null) =>
  useSWR<UserProfileAbout | undefined>(
    username ? ['user-about', username] : null,
    () => profileRepository.getAbout(username!),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

export const useUserSocial = (username?: string | null) =>
  useSWR<UserSocialLinks | undefined>(
    username ? ['user-social', username] : null,
    () => profileRepository.getSocial(username!),
    { revalidateOnFocus: false },
  );

export const useUserAchievements = (username?: string | null) =>
  useSWR<UserAchievement[]>(
    username ? ['user-achievements', username] : null,
    () => profileRepository.getAchievements(username!),
    { revalidateOnFocus: false },
  );

export const useUserCompetitionPrizes = (username?: string | null) =>
  useSWR<UserCompetitionPrize[]>(
    username ? ['user-competition-prizes', username] : null,
    () => profileRepository.getCompetitionPrizes(username!),
    { revalidateOnFocus: false },
  );

export const useUserFollowers = (
  username?: string | null,
  params?: { page?: number; pageSize?: number },
) =>
  useSWR<UserFollowersPreview>(
    username ? ['user-followers', username, params?.page, params?.pageSize] : null,
    () => profileRepository.getFollowers(username!, params),
    { revalidateOnFocus: false },
  );
