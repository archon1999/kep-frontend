export interface PageResult<T = any> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: Array<T>;
}
