import { createKeyFactory } from 'shared/api';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { HttpHomeRepository } from '../data-access/repository/http.home.repository';
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
} from '../domain/entities/home.entity';

const repository = new HttpHomeRepository();
const homeKeys = createKeyFactory('home');

const useHomeSWR = <T>(key: readonly unknown[] | null, fetcher: () => Promise<T>) =>
  useSWR<T>(key, fetcher, { suspense: false });

const mapListParams = (pageSize?: number): HomeListParams => ({ pageSize });

export const useHomeNews = (pageSize = 3) =>
  useHomeSWR<HomeNewsList>(homeKeys.detail(`news-${pageSize}`), () => repository.getNews(mapListParams(pageSize)));

export const useHomePosts = (pageSize = 6) =>
  useHomeSWR<HomePostsList>(homeKeys.detail(`posts-${pageSize}`), () => repository.getPosts(mapListParams(pageSize)));

export const useTopUsers = (pageSize = 3) =>
  useHomeSWR<HomeTopUsers>(homeKeys.detail(`top-users-${pageSize}`), () => repository.getTopUsers(mapListParams(pageSize)));

export const useNextBirthdays = (pageSize = 5) =>
  useHomeSWR<HomeNextBirthdays>(homeKeys.detail(`birthdays-${pageSize}`), () =>
    repository.getNextBirthdays(mapListParams(pageSize)),
  );

export const useOnlineUsers = (pageSize = 8) =>
  useHomeSWR<HomeOnlineUsers>(homeKeys.detail(`online-${pageSize}`), () =>
    repository.getOnlineUsers(mapListParams(pageSize)),
  );

export const useUsersChart = () =>
  useHomeSWR<HomeUsersChart>(homeKeys.detail('users-chart'), () => repository.getUsersChart());

export const useUserActivityStatistics = () =>
  useHomeSWR<HomeUserActivityStatistics>(homeKeys.detail('user-activity-statistics'), () =>
    repository.getUserActivityStatistics(),
  );

export const useUserRatings = (username?: string | null) =>
  useHomeSWR<HomeUserRatings | null>(username ? homeKeys.detail(`ratings-${username}`) : null, () =>
    repository.getUserRatings(username as string),
  );

export const useUserActivityHistory = (username?: string | null, pageSize = 4) => {
  type ActivityHistoryKey = readonly ['home', 'activity-history', string, number, number];

  const {
    data,
    isLoading,
    isValidating,
    size,
    setSize,
  } = useSWRInfinite<HomeUserActivityHistory>(
    (pageIndex: number, previousPageData: HomeUserActivityHistory | null) => {
      if (!username) return null;

      if (previousPageData && pageIndex >= previousPageData.pagesCount) {
        return null;
      }

      return ['home', 'activity-history', username, pageSize, pageIndex + 1] as const;
    },
    ([, , usernameParam, pageSizeParam, page]: ActivityHistoryKey) =>
      repository.getUserActivityHistory(usernameParam, {
        page,
        pageSize: pageSizeParam,
      }),
    { suspense: false },
  );

  const pages: HomeUserActivityHistory[] = data ?? [];
  const mergedHistory = pages.length
    ? {
        ...pages[pages.length - 1],
        data: pages.flatMap((pageItem: HomeUserActivityHistory) => pageItem.data),
      }
    : null;

  const lastPage = pages[pages.length - 1];
  const hasMore = Boolean(lastPage && lastPage.page < lastPage.pagesCount);
  const isLoadingMore = isValidating && pages.length < size;

  const loadMore = () => {
    if (hasMore) {
      setSize((current: number) => current + 1);
    }
  };

  return {
    data: mergedHistory,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  };
};

export const useLandingPageStatistics = () =>
  useHomeSWR<HomeLandingPageStatistics>(homeKeys.detail('landing-page-statistics'), () =>
    repository.getLandingPageStatistics(),
  );
