import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { TournamentDetailEntity, TournamentListItem } from '../../domain/entities/tournament.entity';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';
import { tournamentsApiClient } from '../api/tournaments.client';
import { mapPageResult, mapTournamentDetail, mapTournamentListItem } from '../mappers/tournament.mapper';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentListItem>> {
    const result = await tournamentsApiClient.list(params);
    return mapPageResult(result, mapTournamentListItem);
  }

  async getById(id: number | string): Promise<TournamentDetailEntity> {
    const result = await tournamentsApiClient.getById(String(id));
    return mapTournamentDetail(result as any);
  }
}
