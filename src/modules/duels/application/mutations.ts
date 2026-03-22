import useSWRMutation from 'swr/mutation';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import {
  DuelAcceptPayload,
  DuelCounterPayload,
  DuelCreatePayload,
} from '../domain/ports/duels.repository.ts';
import { duelsQueries } from './queries.ts';

const duelsRepository = new HttpDuelsRepository();

export const useCreateDuelCall = () =>
  useSWRMutation('duel-calls-create', (_key, { arg }: { arg: DuelCreatePayload }) =>
    duelsRepository.createDuelCall(arg),
  );

export const useAcceptDuelCall = () =>
  useSWRMutation(
    'duel-calls-accept',
    (
      _key,
      { arg }: { arg: { id: number; payload: DuelAcceptPayload } },
    ) => duelsRepository.acceptDuelCall(arg.id, arg.payload),
  );

export const useConfirmDuelCall = () =>
  useSWRMutation('duel-calls-confirm', (_key, { arg }: { arg: number }) =>
    duelsRepository.confirmDuelCall(arg),
  );

export const useRejectDuelCall = () =>
  useSWRMutation('duel-calls-reject', (_key, { arg }: { arg: number }) =>
    duelsRepository.rejectDuelCall(arg),
  );

export const useCancelDuelCall = () =>
  useSWRMutation('duel-calls-cancel', (_key, { arg }: { arg: number }) =>
    duelsRepository.cancelDuelCall(arg),
  );

export const useCounterDuelCall = () =>
  useSWRMutation(
    'duel-calls-counter',
    (
      _key,
      { arg }: { arg: { id: number; payload: DuelCounterPayload } },
    ) => duelsRepository.counterDuelCall(arg.id, arg.payload),
  );

export const duelsMutations = {
  duelsRepository,
  duelsQueries,
};
