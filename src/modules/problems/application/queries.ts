import useSWR from 'swr';
import { problemsRepository } from '../data-access';
import type { ProblemsRepository } from '../domain/contracts/problems.repository';
import {
  AttemptsListParams,
  ProblemSolversParams,
  ProblemsListParams,
  ProblemsRatingHistoryParams,
  ProblemsRatingParams,
  ProblemsStatisticsParams,
  RecommendationResolveParams,
} from '../domain/contracts/problems.repository.ts';

export const useProblemsList = (params: ProblemsListParams | null) =>
  useSWR(params ? ['problems-list', params] : null, () => problemsRepository.list(params!));

export const useProblemLanguages = () =>
  useSWR(['problems-languages'], () => problemsRepository.listLanguages());

export const useProblemCategories = () =>
  useSWR(['problems-categories'], () => problemsRepository.listCategories());

export const useProblemGroups = () =>
  useSWR(['problems-groups'], () => problemsRepository.listGroups());

export const useStudyPlans = () =>
  useSWR(['study-plans'], () => problemsRepository.listStudyPlans(), {
    revalidateOnFocus: false,
  });

export const useRecommendationResolve = (payload?: RecommendationResolveParams) =>
  useSWR(
    payload ? ['problems-recommendation-resolve', payload] : null,
    () => problemsRepository.resolveRecommendation(payload!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useStudyPlan = (studyPlanId?: number) =>
  useSWR(
    studyPlanId ? ['study-plan', studyPlanId] : null,
    () => problemsRepository.getStudyPlan(studyPlanId!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useMostViewedProblems = () =>
  useSWR(['problems-most-viewed'], () => problemsRepository.listMostViewed());

export const useLastContestProblems = () =>
  useSWR(['problems-last-contest'], () => problemsRepository.getLastContest());

export const useUserProblemsAttempts = (username?: string, pageSize = 10) =>
  useSWR(username ? ['problems-user-attempts', username, pageSize] : null, () =>
    problemsRepository.listUserAttempts(username!, pageSize),
  );

export const useUserProblemsRating = (username?: string) =>
  useSWR(username ? ['problems-user-rating', username] : null, () =>
    problemsRepository.getUserRating(username!),
  );

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

export const useAttemptVerdicts = () =>
  useSWR(['attempts-verdicts'], () => problemsRepository.listVerdicts());

export const useProblemDetail = (problemId?: number) =>
  useSWR(
    problemId ? ['problem-detail', problemId] : null,
    () => problemsRepository.getProblem(problemId!),
    { keepPreviousData: true },
  );

export const useProblemStatistics = (problemId?: number) =>
  useSWR(problemId ? ['problem-statistics', problemId] : null, () =>
    problemsRepository.getProblemStatistics(problemId!),
  );

export const useProblemSolvers = (problemId?: number, params?: ProblemSolversParams) =>
  useSWR(
    problemId ? ['problem-solvers', problemId, params] : null,
    () => problemsRepository.listProblemSolvers(problemId!, params),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

export const useProblemsUserStatistics = (username?: string, params?: ProblemsStatisticsParams) =>
  useSWR(
    username ? ['problems-user-statistics', username, params] : null,
    () => problemsRepository.getUserStatistics(username!, params),
    { revalidateOnFocus: false },
  );

export const useProblemsUserStatisticsActivity = (username?: string, days?: number) =>
  useSWR(
    username ? ['problems-user-statistics-activity', username, days] : null,
    () => problemsRepository.getUserStatisticsActivity(username!, { days }),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

export const useProblemsUserStatisticsHeatmap = (username?: string, year?: number) =>
  useSWR(
    username ? ['problems-user-statistics-heatmap', username, year ?? 'recent'] : null,
    () => problemsRepository.getUserStatisticsHeatmap(username!, { year }),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

export const useProblemSolution = (problemId?: number, enabled = false, localeKey?: string) =>
  useSWR(
    problemId && enabled ? ['problem-solution', problemId, localeKey ?? 'default'] : null,
    () => problemsRepository.getProblemSolution(problemId!),
  );

export const useProblemTags = (enabled = false) =>
  useSWR(enabled ? ['problem-tags'] : null, () => problemsRepository.listTags());

export const useProblemTopics = (enabled = false) =>
  useSWR(enabled ? ['problem-topics'] : null, () => problemsRepository.listTopics());

export const getPreviousProblemId = (...args: Parameters<ProblemsRepository['getProblemPrev']>) =>
  problemsRepository.getProblemPrev(...args);

export const getNextProblemId = (...args: Parameters<ProblemsRepository['getProblemNext']>) =>
  problemsRepository.getProblemNext(...args);

export const getAttemptDetails = (...args: Parameters<ProblemsRepository['getAttempt']>) =>
  problemsRepository.getAttempt(...args);

export const getStudyPlanDetails = (...args: Parameters<ProblemsRepository['getStudyPlan']>) =>
  problemsRepository.getStudyPlan(...args);

export const useProblemSuggestions = (search: string) =>
  useSWR(['attempts-problem-options', search], async () => {
    const result = await problemsRepository.list({
      search: search.trim() || undefined,
      page: 1,
      pageSize: 10,
      ordering: 'id',
    });
    return result.data.map(({ id, title }) => ({ id, title }));
  });

export const useDuelWorkspaceAttempts = (params: AttemptsListParams | null) =>
  useSWR(
    params ? ['duel-workspace-attempts', params] : null,
    () => problemsRepository.listAttempts(params!),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
