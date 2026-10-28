import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { adminApiClient } from '../data-access/adminApiClient';
import type { AdminListParams, AdminPaginatedResponse } from '../domain/types';

export const useAdminResourceList = <T>(resource: string, params: AdminListParams) =>
  useSWR([`admin-${resource}`, params], () => adminApiClient.list<T>(resource, params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useAdminResourceDetail = <T>(resource: string, id?: number | string) =>
  useSWR(id ? [`admin-${resource}`, id] : null, () => adminApiClient.read<T>(resource, id!), {
    revalidateOnFocus: false,
  });

export const useAdminResourceMeta = <T>(resource: string, metaResource?: string) =>
  useSWR(
    metaResource ? [`admin-${resource}-meta`] : null,
    () => adminApiClient.meta<T>(metaResource ?? resource),
    { revalidateOnFocus: false },
  );

export const useAdminResourceOptions = <T>(resource: string, search: string, enabled: boolean) =>
  useSWRInfinite(
    (pageIndex: number, previousPage: AdminPaginatedResponse<T> | null) =>
      !enabled || (previousPage && previousPage.page >= previousPage.pagesCount)
        ? null
        : (['admin-autocomplete', resource, search, pageIndex + 1] as const),
    ([, currentResource, term, page]) =>
      adminApiClient.list<T>(currentResource, { page, pageSize: 20, term }),
    {
      keepPreviousData: true,
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );
