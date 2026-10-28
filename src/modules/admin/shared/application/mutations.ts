import { adminApiClient } from '../data-access/adminApiClient';
import type { AdminBatchPayload } from '../domain/types';

export const createAdminResource = <T, TPayload>(resource: string, payload: TPayload) =>
  adminApiClient.create<T, TPayload>(resource, payload);
export const updateAdminResource = <T, TPayload>(
  resource: string,
  id: number | string,
  payload: TPayload,
) => adminApiClient.update<T, TPayload>(resource, id, payload);
export const removeAdminResource = (resource: string, id: number | string) =>
  adminApiClient.remove(resource, id);
export const batchAdminResources = <TAction extends string>(
  resource: string,
  payload: AdminBatchPayload<TAction>,
) => adminApiClient.batch(resource, payload);
