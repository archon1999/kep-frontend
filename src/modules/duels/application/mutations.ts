import useSWRMutation from 'swr/mutation';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import {
  DuelCounterPayload,
  DuelCreatePayload,
} from '../domain/ports/duels.repository.ts';
import { duelsQueries } from './queries.ts';

const duelsRepository = new HttpDuelsRepository();

export const useUpdateReadyStatus = () =>
  useSWRMutation('duels-ready-status', (_key, { arg }: { arg: boolean }) =>
    duelsRepository.updateReadyStatus(arg),
  );

export const useCreateInvitation = () =>
  useSWRMutation('duel-invitations-create', (_key, { arg }: { arg: DuelCreatePayload }) =>
    duelsRepository.createInvitation(arg),
  );

export const useAcceptInvitation = () =>
  useSWRMutation('duel-invitations-accept', (_key, { arg }: { arg: number }) =>
    duelsRepository.acceptInvitation(arg),
  );

export const useRejectInvitation = () =>
  useSWRMutation('duel-invitations-reject', (_key, { arg }: { arg: number }) =>
    duelsRepository.rejectInvitation(arg),
  );

export const useCounterInvitation = () =>
  useSWRMutation(
    'duel-invitations-counter',
    (
      _key,
      { arg }: { arg: { id: number; payload: DuelCounterPayload } },
    ) => duelsRepository.counterInvitation(arg.id, arg.payload),
  );

export const duelsMutations = {
  duelsRepository,
  duelsQueries,
};
