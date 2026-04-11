export interface AdminPaginatedResponse<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export type AdminListParamValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>
  | null
  | undefined;

export interface AdminListParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
  [key: string]: AdminListParamValue;
}

export interface AdminBatchPayload<TAction extends string = string> {
  ids: Array<number | string>;
  action: TAction;
}

export interface AdminBatchResponse {
  count: number;
}

export interface AdminChoiceOption<TValue extends string | number = string | number> {
  value: TValue;
  label: string;
}

export interface AdminIdNameOption {
  id: number;
  name: string;
}
