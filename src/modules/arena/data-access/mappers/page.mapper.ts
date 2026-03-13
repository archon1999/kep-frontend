import { PageResult } from '../../domain/ports/arena.repository';

export const mapPageResult = <T>(data: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: data?.page ?? 1,
  pageSize: data?.pageSize ?? data?.page_size ?? 0,
  count: data?.count ?? data?.results?.length ?? 0,
  total: data?.total ?? data?.count ?? 0,
  pagesCount: data?.pagesCount ?? data?.pages_count ?? 0,
  data: Array.isArray(data?.data)
    ? data.data.map(mapItem)
    : Array.isArray(data?.results)
      ? data.results.map(mapItem)
      : [],
});
