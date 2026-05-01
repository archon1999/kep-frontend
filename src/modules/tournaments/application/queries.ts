import useSWR, { type SWRConfiguration } from 'swr';
import type { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { tournamentsRepository } from '../data-access';
import type { PageResult, TournamentDetailEntity, TournamentListItem } from '../domain';
import { tournamentsKeys } from './keys';

export const useTournamentsList = (
  params?: ApiTournamentsListParams,
  config?: SWRConfiguration<PageResult<TournamentListItem>>,
) =>
  useSWR<PageResult<TournamentListItem>>(
    tournamentsKeys.list(params as Record<string, unknown> | undefined),
    () => tournamentsRepository.list(params),
    {
      suspense: false,
      ...config,
    },
  );

export const useTournament = (id?: string, config?: SWRConfiguration<TournamentDetailEntity>) =>
  useSWR<TournamentDetailEntity>(id ? tournamentsKeys.detail(id) : null, () => tournamentsRepository.getById(id!), {
    suspense: false,
    ...config,
  });
