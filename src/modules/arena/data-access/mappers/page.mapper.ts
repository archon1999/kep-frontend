import { PageResult } from '../../domain/ports/arena.repository';

export const mapPageResult = <T>(data: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: data?.page ?? 1,
  pageSize: data?.pageSize ?? data?.page_size ?? (Array.isArray(data) ? data.length : 0),
  count: Array.isArray(data) ? data.length : data?.count ?? data?.results?.length ?? 0,
  total: Array.isArray(data) ? data.length : data?.total ?? data?.count ?? 0,
  pagesCount: Array.isArray(data) ? 1 : data?.pagesCount ?? data?.pages_count ?? 0,
  data: Array.isArray(data)
    ? data.map(mapItem)
    : Array.isArray(data?.data)
      ? data.data.map(mapItem)
      : Array.isArray(data?.results)
        ? data.results.map(mapItem)
        : [],
  pinnedRows: ((data as any)?.pinnedRows ?? (data as any)?.pinned_rows ?? []).map(
    (item: any) => mapItem(item),
  ),
});
