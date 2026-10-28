import { adminApiClient } from 'modules/admin/shared/data-access/adminApiClient';
import { AdminListParams } from 'modules/admin/shared/domain/types';
import { AdminContest, AdminContestMeta, AdminContestPayload } from '../domain/types';

const RESOURCE = 'contests';
type AdminContestBatchAction = 'delete' | 'showProblems' | 'hideProblems' | 'updatePerformance';

export const contestsAdminClient = {
  list: (params?: AdminListParams) => adminApiClient.list<AdminContest>(RESOURCE, params),
  read: (id: number | string) => adminApiClient.read<AdminContest>(RESOURCE, id),
  create: (payload: AdminContestPayload) =>
    adminApiClient.create<AdminContest, AdminContestPayload>(RESOURCE, payload),
  update: (id: number | string, payload: Partial<AdminContestPayload>) =>
    adminApiClient.update<AdminContest, Partial<AdminContestPayload>>(RESOURCE, id, payload),
  remove: (id: number | string) => adminApiClient.remove(RESOURCE, id),
  batch: (payload: { ids: Array<number | string>; action: AdminContestBatchAction }) =>
    adminApiClient.batch<AdminContestBatchAction>(RESOURCE, payload),
  meta: () => adminApiClient.meta<AdminContestMeta>(RESOURCE),
};
