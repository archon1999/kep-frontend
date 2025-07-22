import { ExtractKeys } from './utils';

export interface ColumnConfig<T, K = ExtractKeys<T>> {
  field: K extends ExtractKeys<T> ? K : (row: T) => any;
  header: string;
  icon?:string;
  key?: string;
  sortable?: boolean;
  orderingKey?: string;
}

export interface PageResult<T = any> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export type PageParams = {
  page?: number;
  pageSize?: number;
  ordering?: string;
} & { [key: string]: any };
