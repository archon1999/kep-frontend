import useSWR from 'swr';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository';
import { TournamentDetailEntity, TournamentListItem } from '../domain/entities/tournament.entity';
import { PageResult } from '../domain/ports/tournaments.repository';

const tournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (params?: ApiTournamentsListParams) =>
  useSWR<PageResult<TournamentListItem>>(
    ['tournaments-list', params?.page, params?.pageSize],
    () => tournamentsRepository.list(params),
  );

export const useTournament = (id?: string) =>
  useSWR<TournamentDetailEntity>(id ? ['tournament', id] : null, () => tournamentsRepository.getById(id!));

export const tournamentsQueries = {
  tournamentsRepository,
};
