import { adminApiClient } from 'modules/admin/shared/data-access/adminApiClient';
import { AdminListParams } from 'modules/admin/shared/domain/types';
import { AdminContest, AdminContestMeta, AdminContestPayload } from '../domain/types';

const RESOURCE = 'contests';

export const contestsAdminClient = {
  list: (params?: AdminListParams) => adminApiClient.list<AdminContest>(RESOURCE, params),
  read: (id: number | string) => adminApiClient.read<AdminContest>(RESOURCE, id),
  create: (payload: AdminContestPayload) =>
    adminApiClient.create<AdminContest, AdminContestPayload>(RESOURCE, payload),
  update: (id: number | string, payload: AdminContestPayload) =>
    adminApiClient.update<AdminContest, AdminContestPayload>(RESOURCE, id, payload),
  remove: (id: number | string) => adminApiClient.remove(RESOURCE, id),
  meta: () => adminApiClient.meta<AdminContestMeta>(RESOURCE),
};
