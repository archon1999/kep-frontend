import { axiosMutator } from 'shared/api/http/axiosMutator';
import { normalizeAdminApiResponse, normalizeAdminPaginatedResponse } from './caseMapper';
import { AdminListParams, AdminPaginatedResponse } from '../domain/types';

const toApiListParams = (params?: AdminListParams) => ({
  page: params?.page,
  page_size: params?.pageSize,
  ordering: params?.ordering,
  search: params?.search || undefined,
});

export const adminApiClient = {
  list: async <T>(resource: string, params?: AdminListParams) => {
    const response = await axiosMutator<AdminPaginatedResponse<unknown>>({
      url: `/api/admin/${resource}/`,
      method: 'GET',
      params: toApiListParams(params),
    });

    return normalizeAdminPaginatedResponse<T>(response);
  },
  read: async <T>(resource: string, id: number | string) => {
    const response = await axiosMutator<unknown>({
      url: `/api/admin/${resource}/${id}/`,
      method: 'GET',
    });

    return normalizeAdminApiResponse<T>(response);
  },
  create: async <T, TPayload>(resource: string, payload: TPayload) => {
    const response = await axiosMutator<unknown>({
      url: `/api/admin/${resource}/`,
      method: 'POST',
      data: payload,
    });

    return normalizeAdminApiResponse<T>(response);
  },
  update: async <T, TPayload>(resource: string, id: number | string, payload: TPayload) => {
    const response = await axiosMutator<unknown>({
      url: `/api/admin/${resource}/${id}/`,
      method: 'PATCH',
      data: payload,
    });

    return normalizeAdminApiResponse<T>(response);
  },
  remove: (resource: string, id: number | string) =>
    axiosMutator<void>({
      url: `/api/admin/${resource}/${id}/`,
      method: 'DELETE',
    }),
  meta: async <T>(resource: string) => {
    const response = await axiosMutator<unknown>({
      url: `/api/admin/${resource}/meta/`,
      method: 'GET',
    });

    return normalizeAdminApiResponse<T>(response);
  },
};
