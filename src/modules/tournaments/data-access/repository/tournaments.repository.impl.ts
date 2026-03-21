import { apiClient } from 'shared/api';
import type { ApiTournamentsList200, ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import type { PageResult, TournamentDetailEntity, TournamentListItem, TournamentsRepository } from '../../domain';
import { mapPageResult, mapTournamentDetail, mapTournamentListItem } from '../mappers/tournament.mapper';

export class TournamentsRepositoryImpl implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentListItem>> {
    const result = (await apiClient.apiTournamentsList(params)) as ApiTournamentsList200;
    return mapPageResult(result, mapTournamentListItem);
  }

  async getById(id: number | string): Promise<TournamentDetailEntity> {
    const result = await apiClient.apiTournamentsRead(String(id));
    return mapTournamentDetail(result as any);
  }
}

export const tournamentsRepository = new TournamentsRepositoryImpl();
