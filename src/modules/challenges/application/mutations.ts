import useSWRMutation from 'swr/mutation';
import { HttpChallengesRepository } from '../data-access/repository/http.challenges.repository.ts';
import { ChallengeAnswerPayload, ChallengeCheckResponse, ChallengeStartResponse } from '../domain/ports/challenges.repository.ts';
import { challengesQueries } from './queries.ts';

const challengesRepository = new HttpChallengesRepository();

export const useCreateChallengeCall = () =>
  useSWRMutation<void, Error, string, { timeSeconds: number; questionsCount: number; chapters?: number[] }>(
    'challenge-calls',
    (_, { arg }) => challengesRepository.createChallengeCall(arg),
  );

export const useDeleteChallengeCall = () =>
  useSWRMutation<void, Error, string, number>('challenge-calls', (_, { arg }) =>
    challengesRepository.deleteChallengeCall(arg),
  );

export const useAcceptChallengeCall = () =>
  useSWRMutation<ChallengeStartResponse, Error, string, number>('accept-challenge-call', (_, { arg }) =>
    challengesRepository.acceptChallengeCall(arg),
  );

export const useStartChallenge = () =>
  useSWRMutation<void, Error, string, number>('start-challenge', (_, { arg }) =>
    challengesRepository.startChallenge(arg),
  );

export const useSubmitChallengeAnswer = () =>
  useSWRMutation<
    ChallengeCheckResponse,
    Error,
    string,
    { challengeId: number; payload: ChallengeAnswerPayload }
  >('submit-challenge-answer', (_, { arg }) => challengesRepository.submitAnswer(arg.challengeId, arg.payload));

export const challengesMutations = {
  challengesRepository,
  challengesQueries,
};
