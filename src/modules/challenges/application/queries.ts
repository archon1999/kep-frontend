import useSWR from 'swr';
import { HttpChallengesRepository } from '../data-access/repository/http.challenges.repository.ts';
import {
  Challenge,
  ChallengeCall,
  ChallengeRatingChange,
  ChallengeRatingRow,
  ChallengeUserStatistics,
} from '../domain';
import { ChallengeRatingParams, PageResult } from '../domain/ports/challenges.repository.ts';

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
  useSWR<Challenge>(
    challengeId ? ['challenge-detail', challengeId] : null,
    () => challengesRepository.getChallenge(challengeId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

export const useChallengesRating = (params?: ChallengeRatingParams) =>
  useSWR<PageResult<ChallengeRatingRow>>(
    ['challenges-rating', params?.page, params?.pageSize, params?.ordering, params?.pinCurrentUser],
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

export const useChallengeUserStatistics = (username?: string) =>
  useSWR<ChallengeUserStatistics | null>(username ? ['challenge-user-statistics', username] : null, () =>
    challengesRepository.getUserStatistics(username!),
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
