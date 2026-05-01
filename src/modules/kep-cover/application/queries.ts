import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { HttpKepCoverRepository } from '../data-access/repository/http.kep-cover.repository';
import type { KepCoverContestSummary, KepCoverEntry } from '../domain/entities/kep-cover.entity';
import type { PageResult } from '../domain/ports/kep-cover.repository';

const repository = new HttpKepCoverRepository();

export const useKepCoverSummary = () =>
  useSWR<KepCoverContestSummary>('kep-cover-summary', () => repository.getSummary(), { suspense: false });

export const useKepCoverEntries = (pageSize = 12) => {
  type EntriesKey = readonly ['kep-cover-entries', number, number];

  const { data, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<PageResult<KepCoverEntry>>(
    (pageIndex: number, previousPageData: PageResult<KepCoverEntry> | null) => {
      if (previousPageData && pageIndex >= previousPageData.pagesCount) {
        return null;
      }

      return ['kep-cover-entries', pageSize, pageIndex + 1] as const;
    },
    ([, pageSizeParam, page]: EntriesKey) => repository.getEntries({ page, pageSize: pageSizeParam }),
    { suspense: false },
  );

  const pages = data ?? [];
  const mergedPage = pages.length
    ? {
        ...pages[pages.length - 1],
        data: pages.flatMap((pageItem) => pageItem.data),
      }
    : null;

  const lastPage = pages[pages.length - 1];
  const hasMore = Boolean(lastPage && lastPage.page < lastPage.pagesCount);
  const isLoadingMore = isValidating && pages.length < size;

  const loadMore = () => {
    if (hasMore) {
      setSize((current) => current + 1);
    }
  };

  return {
    data: mergedPage,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate,
  };
};

export const kepCoverQueries = {
  repository,
};
