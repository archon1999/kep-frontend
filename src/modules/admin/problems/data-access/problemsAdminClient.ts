import { adminApiClient } from 'modules/admin/shared/data-access/adminApiClient';
import { AdminListParams } from 'modules/admin/shared/domain/types';
import { AdminProblem, AdminProblemMeta, AdminProblemPayload } from '../domain/types';

const RESOURCE = 'problems';
type AdminProblemBatchAction = 'delete' | 'show' | 'hide';

export const problemsAdminClient = {
  list: (params?: AdminListParams) => adminApiClient.list<AdminProblem>(RESOURCE, params),
  read: (id: number | string) => adminApiClient.read<AdminProblem>(RESOURCE, id),
  create: (payload: AdminProblemPayload) =>
    adminApiClient.create<AdminProblem, AdminProblemPayload>(RESOURCE, payload),
  update: (id: number | string, payload: Partial<AdminProblemPayload>) =>
    adminApiClient.update<AdminProblem, Partial<AdminProblemPayload>>(RESOURCE, id, payload),
  remove: (id: number | string) => adminApiClient.remove(RESOURCE, id),
  batch: (payload: { ids: Array<number | string>; action: AdminProblemBatchAction }) =>
    adminApiClient.batch<AdminProblemBatchAction>(RESOURCE, payload),
  meta: () => adminApiClient.meta<AdminProblemMeta>(RESOURCE),
};
