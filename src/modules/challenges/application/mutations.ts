import useSWRMutation from 'swr/mutation';
import { challengesRepository } from '../data-access';
import {
  ChallengeAnswerPayload,
  ChallengeAntiCheatPenaltyPayload,
  ChallengeAntiCheatPenaltyResponse,
  ChallengeCheckResponse,
  ChallengeStartResponse,
  ChessMovePayload,
  ChessMoveResponse,
} from '../domain/contracts/challenges.repository.ts';

export const useCreateChallengeCall = () =>
  useSWRMutation<
    void,
    Error,
    string,
    { timeSeconds: number; questionsCount: number; chapters?: number[] }
  >('challenge-calls', (_, { arg }) => challengesRepository.createChallengeCall(arg));

export const useDeleteChallengeCall = () =>
  useSWRMutation<void, Error, string, number>('challenge-calls', (_, { arg }) =>
    challengesRepository.deleteChallengeCall(arg),
  );

export const useAcceptChallengeCall = () =>
  useSWRMutation<ChallengeStartResponse, Error, string, number>(
    'accept-challenge-call',
    (_, { arg }) => challengesRepository.acceptChallengeCall(arg),
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
  >('submit-challenge-answer', (_, { arg }) =>
    challengesRepository.submitAnswer(arg.challengeId, arg.payload),
  );

export const useSubmitChessMove = () =>
  useSWRMutation<
    ChessMoveResponse,
    Error,
    string,
    { challengeId: number; payload: ChessMovePayload }
  >('submit-chess-move', (_, { arg }) =>
    challengesRepository.submitChessMove(arg.challengeId, arg.payload),
  );

export const useApplyChallengeAntiCheatPenalty = () =>
  useSWRMutation<
    ChallengeAntiCheatPenaltyResponse,
    Error,
    string,
    { challengeId: number; payload: ChallengeAntiCheatPenaltyPayload }
  >('apply-challenge-anti-cheat-penalty', (_, { arg }) =>
    challengesRepository.applyAntiCheatPenalty(arg.challengeId, arg.payload),
  );

export const sendChallengeAntiCheatPenaltyOnExit = (
  challengeId: number | string,
  payload: ChallengeAntiCheatPenaltyPayload,
) => challengesRepository.sendAntiCheatPenaltyOnExit(challengeId, payload);
