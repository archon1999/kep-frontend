import useSWR from 'swr';
import { HttpChallengesRepository } from '../data-access/repository/http.challenges.repository.ts';
import {
  Challenge,
  ChallengeCall,
  ChallengeRatingChange,
  ChallengeRatingRow,
} from '../domain';
import { PageResult } from '../domain/ports/challenges.repository.ts';

const challengesRepository = new HttpChallengesRepository();

export const useChallengeCalls = () =>
  useSWR<ChallengeCall[]>(
    'challenge-calls',
    () => challengesRepository.getChallengeCalls(),
    { refreshInterval: 5000, revalidateOnFocus: false },
  );

export const useChallengesList = (params?: {
  page?: number;
  pageSize?: number;
  ordering?: string;
  username?: string;
}) =>
  useSWR<PageResult<Challenge>>(
    ['challenges-list', params?.page, params?.pageSize, params?.ordering, params?.username],
    () => challengesRepository.listChallenges(params),
  );

export const useChallengeDetail = (challengeId?: string) =>
  useSWR<Challenge>(challengeId ? ['challenge-detail', challengeId] : null, () =>
    challengesRepository.getChallenge(challengeId!),
  );

export const useChallengesRating = (params?: { page?: number; pageSize?: number; ordering?: string }) =>
  useSWR<PageResult<ChallengeRatingRow>>(
    ['challenges-rating', params?.page, params?.pageSize, params?.ordering],
    () => challengesRepository.listRating(params),
  );

export const useChallengeRatingChanges = (username?: string) =>
  useSWR<ChallengeRatingChange[]>(username ? ['challenge-rating-changes', username] : null, () =>
    challengesRepository.listRatingChanges(username!),
  );

export const useChallengeUserRating = (username?: string) =>
  useSWR<ChallengeRatingRow | null>(username ? ['challenge-user-rating', username] : null, () =>
    challengesRepository.getUserRating(username!),
  );

export const useUserChallenges = (params?: { username?: string; page?: number; pageSize?: number }) =>
  useSWR<PageResult<Challenge>>(
    params?.username ? ['user-challenges', params.username, params.page, params.pageSize] : null,
    () => challengesRepository.listUserChallenges({
      username: params!.username!,
      page: params?.page,
      pageSize: params?.pageSize,
    }),
  );

export const useChallengeChapters = () => useSWR(['challenge-chapters'], () => challengesRepository.listChapters());

export const challengesQueries = {
  challengesRepository,
};
