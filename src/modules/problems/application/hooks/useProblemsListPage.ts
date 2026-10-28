import { useAuth } from 'app/providers/AuthProvider.tsx';
import {
  useLastContestProblems,
  useMostViewedProblems,
  useProblemCategories,
  useProblemGroups,
  useProblemLanguages,
  useProblemsList,
  useStudyPlans,
  useUserProblemsAttempts,
  useUserProblemsRating,
} from 'modules/problems/application/queries.ts';
import { useProblemsListFilters } from './useProblemsListFilters';

export const useProblemsListPage = () => {
  const { currentUser } = useAuth();
  const filters = useProblemsListFilters();
  const { filter } = filters;
  const { data: problemsPage, isLoading: isProblemsLoading } = useProblemsList(filter);
  const { data: languages } = useProblemLanguages();
  const { data: categories } = useProblemCategories();
  const { data: groups } = useProblemGroups();
  const {
    data: studyPlans,
    isLoading: isStudyPlansLoading,
    error: studyPlansError,
    mutate: retryStudyPlans,
  } = useStudyPlans();
  const {
    data: mostViewed,
    isLoading: isMostViewedLoading,
    error: mostViewedError,
    mutate: retryMostViewed,
  } = useMostViewedProblems();
  const {
    data: lastContest,
    isLoading: isLastContestLoading,
    error: lastContestError,
    mutate: retryLastContest,
  } = useLastContestProblems();
  const {
    data: attempts,
    isLoading: isAttemptsLoading,
    error: attemptsError,
    mutate: retryAttempts,
  } = useUserProblemsAttempts(currentUser?.username ?? undefined, 10);
  const {
    data: rating,
    isLoading: isRatingLoading,
    error: summaryError,
    mutate: retrySummary,
  } = useUserProblemsRating(currentUser?.username ?? undefined);
  const isSummaryLoading = isRatingLoading;

  const problems = problemsPage?.data ?? [];
  const total = problemsPage?.total ?? 0;

  return {
    ...filters,
    isAuthenticated: Boolean(currentUser),
    problems,
    total,
    isProblemsLoading,
    languages,
    categories,
    groups,
    studyPlans,
    isStudyPlansLoading,
    studyPlansError,
    retryStudyPlans,
    rating,
    isSummaryLoading,
    summaryError,
    retrySummary,
    attempts,
    isAttemptsLoading,
    attemptsError,
    retryAttempts,
    lastContest,
    isLastContestLoading,
    lastContestError,
    retryLastContest,
    mostViewed,
    isMostViewedLoading,
    mostViewedError,
    retryMostViewed,
  };
};
