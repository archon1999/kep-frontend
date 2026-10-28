import useSWR from 'swr';
import { profileRepository, repository } from '../data-access';
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

export const useUsersList = (params: UsersListRequest | null) =>
  useSWR<UsersListResponse>(
    params ? ['users-list', params] : null,
    () => repository.getUsers(params!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

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
  useSWR<UserDetails>(
    username ? ['user-details', username] : null,
    () => repository.getUser(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserRatings = (username?: string | null) =>
  useSWR<UserRatings>(
    username ? ['user-ratings', username] : null,
    () => repository.getUserRatings(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

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
    { keepPreviousData: true, revalidateOnFocus: false },
  );

export const useUserSuggestions = (search: string) =>
  useSWR(['attempts-user-options', search], async () => {
    const result = await repository.getUsers({
      page: 1,
      pageSize: 10,
      search: search.trim() || undefined,
    });
    return result.data.map(({ username, firstName, lastName, avatar }) => ({
      username,
      fullName: `${firstName ?? ''} ${lastName ?? ''}`.trim(),
      avatar,
    }));
  });
