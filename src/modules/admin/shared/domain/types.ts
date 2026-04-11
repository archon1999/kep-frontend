export interface AdminPaginatedResponse<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface AdminListParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
}

export interface AdminChoiceOption<TValue extends string | number = string | number> {
  value: TValue;
  label: string;
}

export interface AdminIdNameOption {
  id: number;
  name: string;
}
