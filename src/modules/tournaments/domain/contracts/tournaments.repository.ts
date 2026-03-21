import type { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import type { TournamentDetailEntity, TournamentListItem } from '../entities';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface TournamentsRepository {
  list: (params?: ApiTournamentsListParams) => Promise<PageResult<TournamentListItem>>;
  getById: (id: number | string) => Promise<TournamentDetailEntity>;
}
