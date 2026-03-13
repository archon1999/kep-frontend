import useSWR from 'swr';
import { HttpProblemsRepository } from '../data-access/repository/http.problems.repository.ts';
import {
  AttemptsListParams,
  HackAttemptsListParams,
  ProblemsListParams,
  ProblemsRatingHistoryParams,
  ProblemsRatingParams,
  ProblemsStatisticsParams,
} from '../domain/ports/problems.repository.ts';

const problemsRepository = new HttpProblemsRepository();

export const useProblemsList = (params: ProblemsListParams) =>
  useSWR(['problems-list', params], () => problemsRepository.list(params));

export const useProblemLanguages = () =>
  useSWR(['problems-languages'], () => problemsRepository.listLanguages());

export const useProblemCategories = () =>
  useSWR(['problems-categories'], () => problemsRepository.listCategories());

export const useMostViewedProblems = () =>
  useSWR(['problems-most-viewed'], () => problemsRepository.listMostViewed());

export const useLastContestProblems = () =>
  useSWR(['problems-last-contest'], () => problemsRepository.getLastContest());

export const useUserProblemsAttempts = (username?: string, pageSize = 10) =>
  useSWR(username ? ['problems-user-attempts', username, pageSize] : null, () =>
    problemsRepository.listUserAttempts(username!, pageSize),
  );

export const useUserProblemsRating = (username?: string) =>
  useSWR(username ? ['problems-user-rating', username] : null, () => problemsRepository.getUserRating(username!));

export const useProblemsRating = (params: ProblemsRatingParams) =>
  useSWR(['problems-rating', params], () => problemsRepository.listRating(params));

export const useProblemsPeriodRating = (period: 'today' | 'week' | 'month') =>
  useSWR(['problems-period-rating', period], () => problemsRepository.listPeriodRating(period));

export const useProblemsRatingHistory = (params: ProblemsRatingHistoryParams) =>
  useSWR(['problems-rating-history', params], () => problemsRepository.listRatingHistory(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useAttemptsList = (params: AttemptsListParams) =>
  useSWR(['problems-attempts', params], () => problemsRepository.listAttempts(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useAttemptVerdicts = () => useSWR(['attempts-verdicts'], () => problemsRepository.listVerdicts());

export const useProblemDetail = (problemId?: number) =>
  useSWR(
    problemId ? ['problem-detail', problemId] : null,
    () => problemsRepository.getProblem(problemId!),
    { keepPreviousData: true },
  );

export const useProblemStatistics = (problemId?: number) =>
  useSWR(
    problemId ? ['problem-statistics', problemId] : null,
    () => problemsRepository.getProblemStatistics(problemId!),
  );

export const useProblemsUserStatistics = (username?: string, params?: ProblemsStatisticsParams) =>
  useSWR(
    username ? ['problems-user-statistics', username, params] : null,
    () => problemsRepository.getUserStatistics(username!, params),
    { revalidateOnFocus: false },
  );

export const useProblemSolution = (problemId?: number, enabled = false) =>
  useSWR(
    problemId && enabled ? ['problem-solution', problemId] : null,
    () => problemsRepository.getProblemSolution(problemId!),
  );

export const useProblemTags = (enabled = false) =>
  useSWR(enabled ? ['problem-tags'] : null, () => problemsRepository.listTags());

export const useProblemTopics = (enabled = false) =>
  useSWR(enabled ? ['problem-topics'] : null, () => problemsRepository.listTopics());

export const useHackAttempts = (params: HackAttemptsListParams) =>
  useSWR(['hack-attempts', params], () => problemsRepository.listHackAttempts(params));

export const problemsQueries = {
  problemsRepository,
};
