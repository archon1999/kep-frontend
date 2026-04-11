import { adminApiClient } from 'modules/admin/shared/data-access/adminApiClient';
import { AdminListParams } from 'modules/admin/shared/domain/types';
import { AdminProblem, AdminProblemMeta, AdminProblemPayload } from '../domain/types';

const RESOURCE = 'problems';

export const problemsAdminClient = {
  list: (params?: AdminListParams) => adminApiClient.list<AdminProblem>(RESOURCE, params),
  read: (id: number | string) => adminApiClient.read<AdminProblem>(RESOURCE, id),
  create: (payload: AdminProblemPayload) =>
    adminApiClient.create<AdminProblem, AdminProblemPayload>(RESOURCE, payload),
  update: (id: number | string, payload: AdminProblemPayload) =>
    adminApiClient.update<AdminProblem, AdminProblemPayload>(RESOURCE, id, payload),
  remove: (id: number | string) => adminApiClient.remove(RESOURCE, id),
  meta: () => adminApiClient.meta<AdminProblemMeta>(RESOURCE),
};
