import { adminApiClient } from 'modules/admin/shared/data-access/adminApiClient';
import { AdminListParams } from 'modules/admin/shared/domain/types';
import { AdminUser, AdminUserPayload } from '../domain/types';

const RESOURCE = 'users';

export const usersAdminClient = {
  list: (params?: AdminListParams) => adminApiClient.list<AdminUser>(RESOURCE, params),
  read: (id: number | string) => adminApiClient.read<AdminUser>(RESOURCE, id),
  create: (payload: AdminUserPayload) =>
    adminApiClient.create<AdminUser, AdminUserPayload>(RESOURCE, payload),
  update: (id: number | string, payload: AdminUserPayload) =>
    adminApiClient.update<AdminUser, AdminUserPayload>(RESOURCE, id, payload),
  remove: (id: number | string) => adminApiClient.remove(RESOURCE, id),
};
