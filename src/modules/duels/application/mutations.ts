import useSWRMutation from 'swr/mutation';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import { DuelCreatePayload } from '../domain/ports/duels.repository.ts';
import { duelsQueries } from './queries.ts';

const duelsRepository = new HttpDuelsRepository();

export const useUpdateReadyStatus = () =>
  useSWRMutation('duels-ready-status', (_key, { arg }: { arg: boolean }) =>
    duelsRepository.updateReadyStatus(arg),
  );

export const useCreateDuel = () =>
  useSWRMutation('duels-create', (_key, { arg }: { arg: DuelCreatePayload }) =>
    duelsRepository.createDuel(arg),
  );

export const useConfirmDuel = () =>
  useSWRMutation('duels-confirm', (_key, { arg }: { arg: number }) => duelsRepository.confirmDuel(arg));

export const duelsMutations = {
  duelsRepository,
  duelsQueries,
};
