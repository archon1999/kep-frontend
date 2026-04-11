import { AdminPaginatedResponse } from '../domain/types';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);

const toSnakeCase = (key: string) => key.replace(/([A-Z])/g, '_$1').toLowerCase();

export const normalizeAdminApiResponse = <T>(value: unknown): T => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeAdminApiResponse(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.entries(value).reduce<Record<string, unknown>>((normalized, [key, item]) => {
      normalized[toSnakeCase(key)] = normalizeAdminApiResponse(item);
      return normalized;
    }, {}) as T;
  }

  return value as T;
};

export const normalizeAdminPaginatedResponse = <T>(
  value: AdminPaginatedResponse<unknown> & { page_size?: number; pages_count?: number },
): AdminPaginatedResponse<T> => ({
  page: value.page,
  pageSize: value.pageSize ?? value.page_size ?? 0,
  count: value.count,
  total: value.total,
  pagesCount: value.pagesCount ?? value.pages_count ?? 0,
  data: normalizeAdminApiResponse<T[]>(value.data ?? []),
});
