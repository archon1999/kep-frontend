import { adminApiClient } from 'modules/admin/shared/helpers/adminApiClient';
import { AdminListParams } from 'modules/admin/shared/helpers/types';
import { AdminUser, AdminUserPayload } from '../domain/types';

const RESOURCE = 'users';
type AdminUserBatchAction = 'delete' | 'disable' | 'updateRatings';

export const usersAdminClient = {
  list: (params?: AdminListParams) => adminApiClient.list<AdminUser>(RESOURCE, params),
  read: (id: number | string) => adminApiClient.read<AdminUser>(RESOURCE, id),
  create: (payload: AdminUserPayload) =>
    adminApiClient.create<AdminUser, AdminUserPayload>(RESOURCE, payload),
  update: (id: number | string, payload: Partial<AdminUserPayload>) =>
    adminApiClient.update<AdminUser, Partial<AdminUserPayload>>(RESOURCE, id, payload),
  remove: (id: number | string) => adminApiClient.remove(RESOURCE, id),
  batch: (payload: { ids: Array<number | string>; action: AdminUserBatchAction }) =>
    adminApiClient.batch<AdminUserBatchAction>(RESOURCE, payload),
  changePassword: (id: number | string, payload: { password: string }) =>
    adminApiClient.action<{ detail: string }, { password: string }>(
      RESOURCE,
      id,
      'change-password',
      payload,
    ),
};
