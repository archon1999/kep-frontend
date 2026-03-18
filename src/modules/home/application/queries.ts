import { createKeyFactory } from 'shared/api';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { getResourceById, resources } from 'app/routes/resources';
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
  HomePromoSlide,
} from '../domain/entities/home.entity';

const repository = new HttpHomeRepository();
const homeKeys = createKeyFactory('home');

const useHomeSWR = <T>(key: readonly unknown[] | null, fetcher: () => Promise<T>) =>
  useSWR<T>(key, fetcher, { suspense: false });

const mapListParams = (pageSize?: number): HomeListParams => ({ pageSize });

const formatDate = (value: string | null | undefined) => (value ? dayjs(value).format('DD MMM, HH:mm') : '-');

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

export const useHomePromos = () => {
  const { t, i18n } = useTranslation();

  return useHomeSWR<HomePromoSlide[]>(
    homeKeys.detail(`promos-${i18n.language}`),
    async () => {
      const promos = await repository.getPromos();

      return promos.map((promo) => {
        if (promo.type === 'kepCover') {
          return {
            id: `kep-cover-${promo.id}-${promo.status}`,
            type: 'kepCover',
            status: promo.status,
            title: promo.title,
            subtitle:
              promo.status === 'active'
                ? t('homePage.promos.kepCover.activeSubtitle')
                : t('homePage.promos.kepCover.upcomingSubtitle'),
            href: resources.KepCover,
            ctaLabel: t('homePage.promos.actions.openKepCover'),
            accent: 'warning',
            icon: 'mdi:image-multiple',
            typeLabel: t('homePage.promos.types.kepCover'),
            startTime: promo.startTime,
            endTime: promo.endTime,
            previewImages: promo.previewImages ?? [],
            topEntries: promo.topEntries ?? [],
            totalEntries: promo.totalEntries ?? 0,
            maxVoteCount: promo.maxVoteCount ?? 0,
            remainingVotes: promo.remainingVotes ?? 0,
            metrics: [
              {
                label: t('homePage.promos.metrics.participants'),
                value: t('kepCover.hero.entries', { count: promo.totalEntries ?? 0 }),
              },
              {
                label: t('homePage.promos.metrics.voteLimit'),
                value: t('homePage.promos.kepCover.voteLimit', { count: promo.maxVoteCount ?? 0 }),
              },
              {
                label: t('homePage.promos.metrics.schedule'),
                value:
                  promo.status === 'active'
                    ? t('homePage.promos.endsAt', { date: formatDate(promo.endTime) })
                    : t('homePage.promos.startsAt', { date: formatDate(promo.startTime) }),
              },
            ],
          };
        }

        if (promo.type === 'contest') {
          return {
            id: `contest-${promo.id}-${promo.status}`,
            type: 'contest',
            status: promo.status,
            title: promo.title,
            subtitle:
              promo.status === 'active'
                ? t('homePage.promos.contest.activeSubtitle')
                : t('homePage.promos.contest.upcomingSubtitle'),
            href: getResourceById(resources.Contest, promo.id),
            ctaLabel: t('homePage.promos.actions.openContest'),
            accent: 'info',
            icon: 'mdi:trophy-outline',
            typeLabel: promo.categoryTitle || t('homePage.promos.types.contest'),
            description: promo.description,
            logo: promo.logo,
            startTime: promo.startTime,
            endTime: promo.endTime,
            isRated: promo.isRated ?? false,
            contestantsCount: promo.contestantsCount ?? 0,
            registrantsCount: promo.registrantsCount ?? 0,
            problemsCount: promo.problemsCount ?? 0,
            metrics: [
              {
                label: t('homePage.promos.metrics.schedule'),
                value:
                  promo.status === 'active'
                    ? t('homePage.promos.endsAt', { date: formatDate(promo.endTime) })
                    : t('homePage.promos.startsAt', { date: formatDate(promo.startTime) }),
              },
              {
                label: t('homePage.promos.metrics.registrants'),
                value: t('contests.registrantsLabel', { count: promo.registrantsCount ?? 0 }),
              },
              {
                label: t('homePage.promos.metrics.problems'),
                value: t('contests.problems', { count: promo.problemsCount ?? 0 }),
              },
            ],
          };
        }

        return {
          id: `arena-${promo.id}-${promo.status}`,
          type: 'arena',
          status: promo.status,
          title: promo.title,
          subtitle:
            promo.status === 'active'
              ? t('homePage.promos.arena.activeSubtitle')
              : t('homePage.promos.arena.upcomingSubtitle'),
          href: getResourceById(resources.ArenaTournament, promo.id),
            ctaLabel: t('homePage.promos.actions.openArena'),
            accent: 'success',
          icon: 'mdi:sword-cross',
          typeLabel: t('homePage.promos.types.arena'),
          startTime: promo.startTime,
          endTime: promo.endTime,
          questionsCount: promo.questionsCount ?? 0,
          timeSeconds: promo.timeSeconds ?? 0,
          chaptersCount: promo.chaptersCount ?? 0,
          chapterTitles: promo.chapterTitles ?? [],
          metrics: [
            {
              label: t('homePage.promos.metrics.schedule'),
              value:
                promo.status === 'active'
                  ? t('homePage.promos.endsAt', { date: formatDate(promo.endTime) })
                  : t('homePage.promos.startsAt', { date: formatDate(promo.startTime) }),
            },
            {
              label: t('homePage.promos.metrics.questions'),
              value: `${promo.questionsCount ?? 0} ${t('arena.questions')}`,
            },
            {
              label: t('homePage.promos.metrics.roundTime'),
              value: t('homePage.promos.arena.roundTime', { count: promo.timeSeconds ?? 0 }),
            },
          ],
        };
      });
    },
  );
};
