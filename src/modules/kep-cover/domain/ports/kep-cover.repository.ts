import { KepCoverContestSummary, KepCoverEntry, KepCoverVoteState } from '../entities/kep-cover.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface KepCoverRepository {
  getSummary: () => Promise<KepCoverContestSummary>;
  getEntries: (params?: { page?: number; pageSize?: number }) => Promise<PageResult<KepCoverEntry>>;
  vote: (entryId: number | string) => Promise<KepCoverVoteState>;
}
