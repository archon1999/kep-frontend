import { axiosMutator } from 'shared/api/http/axiosMutator';
import {
  AdminBatchPayload,
  AdminBatchResponse,
  AdminListParams,
  AdminListParamValue,
  AdminPaginatedResponse,
} from '../domain/types';

const toApiParamValue = (value: AdminListParamValue) => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : undefined;
  }

  return value;
};

const toApiListParams = (params?: AdminListParams) =>
  Object.entries(params ?? {}).reduce<Record<string, AdminListParamValue>>((result, [key, value]) => {
    const apiValue = toApiParamValue(value);

    if (apiValue !== undefined) {
      result[key] = apiValue;
    }

    return result;
  }, {});

export const adminApiClient = {
  list: async <T>(resource: string, params?: AdminListParams) => {
    return axiosMutator<AdminPaginatedResponse<T>>({
      url: `/api/admin/${resource}/`,
      method: 'GET',
      params: toApiListParams(params),
    });
  },
  read: <T>(resource: string, id: number | string) =>
    axiosMutator<T>({
      url: `/api/admin/${resource}/${id}/`,
      method: 'GET',
    }),
  create: <T, TPayload>(resource: string, payload: TPayload) =>
    axiosMutator<T>({
      url: `/api/admin/${resource}/`,
      method: 'POST',
      data: payload,
    }),
  update: <T, TPayload>(resource: string, id: number | string, payload: TPayload) =>
    axiosMutator<T>({
      url: `/api/admin/${resource}/${id}/`,
      method: 'PATCH',
      data: payload,
    }),
  remove: (resource: string, id: number | string) =>
    axiosMutator<void>({
      url: `/api/admin/${resource}/${id}/`,
      method: 'DELETE',
    }),
  batch: async <TAction extends string>(
    resource: string,
    payload: AdminBatchPayload<TAction>,
  ) => {
    return axiosMutator<AdminBatchResponse>({
      url: `/api/admin/${resource}/batch/`,
      method: 'POST',
      data: payload,
    });
  },
  meta: <T>(resource: string) =>
    axiosMutator<T>({
      url: `/api/admin/${resource}/meta/`,
      method: 'GET',
    }),
  action: <T, TPayload>(
    resource: string,
    id: number | string,
    actionName: string,
    payload: TPayload,
  ) =>
    axiosMutator<T>({
      url: `/api/admin/${resource}/${id}/${actionName}/`,
      method: 'POST',
      data: payload,
    }),
};
