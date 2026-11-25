import type { IntegrityRepository } from '../../domain/contracts/integrity.repository';
import { adminRequest } from '../client/adminRequest';

const endpoint = '/api/admin/console/integrity/contests/';
const pairUrl = (contest: number, pair: number) => `${endpoint}${contest}/pairs/${pair}/`;
export const integrityRepository: IntegrityRepository = {
  contests: (q) => adminRequest({ url: endpoint, params: { q } }),
  review: (contest, run) => adminRequest({ url: `${endpoint}${contest}/`, params: { run } }),
  start: (contest) => adminRequest({ url: `${endpoint}${contest}/`, method: 'POST' }),
  pair: (contest, pair, item) => adminRequest({ url: pairUrl(contest, pair), params: { item } }),
  decide: (contest, pair, decision, note, reviewedAt) =>
    adminRequest({
      url: pairUrl(contest, pair),
      method: 'PATCH',
      data: { decision, note, reviewedAt },
    }),
  moderate: (contest, entry, data) =>
    adminRequest({ url: `${endpoint}${contest}/entries/${entry}/`, method: 'POST', data }),
};
