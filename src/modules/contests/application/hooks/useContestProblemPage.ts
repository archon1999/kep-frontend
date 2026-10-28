import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import { useProblemWorkspace } from 'modules/problems/application/hooks/useProblemWorkspace';
import { useAttemptsList } from 'modules/problems/application/queries';
import { getWorkspaceErrorMessage } from 'modules/problems/application/workspace-error';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';
import { enumParam } from 'shared/lib/queryParams';
import { toast } from 'sonner';
import { ContestStatus } from '../../domain/entities/contest-status';
import { sortContestProblems } from '../../domain/utils/sort-contest-problems';
import { submitContestSolution } from '../mutations';
import {
  useContest,
  useContestContestant,
  useContestProblem,
  useContestProblems,
} from '../queries';
import { useContestCountdown } from './useContestCountdown';

export const useContestProblemPage = () => {
  const { id, symbol: problemSymbol } = useParams<{ id: string; symbol: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const navigate = useNavigate();
  const { state, setField } = useRouteQueryState({
    defaults: { activeTab: 'description' as 'description' | 'code' | 'attempts' },
    schema: {
      activeTab: { ...enumParam(['description', 'code', 'attempts'] as const), param: 'tab' },
    },
    historyByKey: { activeTab: 'push' },
  });
  const {
    paginationModel: attemptsPagination,
    onPaginationModelChange: onAttemptsPaginationChange,
    pageParams,
  } = useGridPagination({
    initialPageSize: 10,
    querySync: { pageKey: 'attemptsPage', pageSizeKey: 'attemptsPageSize' },
  });
  const {
    data: contest,
    isLoading: isContestLoading,
    error: contestError,
    mutate: mutateContest,
  } = useContest(contestId);
  const { data: contestProblems, mutate: mutateContestProblems } = useContestProblems(contestId);
  const {
    data: contestProblem,
    isLoading: isProblemLoading,
    error: problemError,
    mutate: mutateProblem,
  } = useContestProblem(contestId, problemSymbol);
  const { data: contestant, mutate: mutateContestant } = useContestContestant(contestId, {
    refreshInterval: 30000,
  });
  const problem = contestProblem?.symbol === problemSymbol ? contestProblem?.problem : undefined;
  const isContestLocked = !contest || contest.statusCode === ContestStatus.NotStarted;
  const scope = `contest:${id}:${problemSymbol}:${currentUser?.username ?? ''}:${isContestLocked}`;
  const workspace = useProblemWorkspace({
    problem,
    scope,
    locked: isContestLocked,
    storageKey: problem
      ? `contest-${contest?.id ?? contestId ?? 'unknown'}-problem-${problem.id}-code`
      : null,
  });
  const submission = useScopedAsyncTask(scope);
  const upsolveHref = problem?.id
    ? getResourceByParams(resources.Problem, { id: problem.id })
    : undefined;
  const canOpenOriginalProblem = Boolean(
    contest?.statusCode === ContestStatus.Finished && upsolveHref,
  );
  useDocumentTitle(contest && problem ? 'pageTitles.contestProblem' : undefined, {
    contestTitle: contest?.title,
    problemSymbol: contestProblem?.symbol ?? '',
    problemTitle: problem?.title,
  });
  const timeLeft = useContestCountdown(contest?.finishTime, contest?.statusCode);
  const {
    data: attemptsPage,
    mutate: mutateAttempts,
    isLoading: isAttemptsLoading,
  } = useAttemptsList({
    contestId,
    contestProblem: problemSymbol,
    username: currentUser?.username,
    page: pageParams.page,
    pageSize: pageParams.pageSize,
    ordering: '-id',
  });
  const sortedProblems = useMemo(
    () => sortContestProblems(contestProblems ?? []),
    [contestProblems],
  );
  const currentIndex = sortedProblems.findIndex((item) => item.symbol === problemSymbol);
  const prevSymbol = currentIndex > 0 ? sortedProblems[currentIndex - 1]?.symbol : null;
  const nextSymbol = currentIndex >= 0 ? sortedProblems[currentIndex + 1]?.symbol : null;
  const navigateProblem = (symbol?: string | null) => {
    if (symbol)
      navigate(getResourceByParams(resources.ContestProblem, { id: contestId ?? '', symbol }));
  };
  const handleSubmit = () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    if (
      !contest?.id ||
      !problem ||
      !problemSymbol ||
      !workspace.selectedLang ||
      !workspace.codeRef.current ||
      isContestLocked
    )
      return;
    return submission.run(
      () =>
        submitContestSolution(contest.id, {
          contestProblem: problemSymbol,
          sourceCode: workspace.codeRef.current,
          lang: workspace.selectedLang,
        }),
      {
        onSuccess: async () => {
          toast.success(t('problems.detail.submitSuccess'));
          setField('activeTab', 'attempts');
          await Promise.allSettled([mutateAttempts(), mutateContestProblems(), mutateContestant()]);
        },
        onError: (error) =>
          toast.error(getWorkspaceErrorMessage(error, t('problems.detail.error'))),
      },
    );
  };
  return {
    ...workspace,
    contest,
    contestId,
    contestant,
    problem,
    problemSymbol,
    currentUser,
    redirectToLogin,
    activeTab: state.activeTab,
    handleTabChange: (value: typeof state.activeTab) => setField('activeTab', value),
    sortedProblems,
    prevSymbol,
    nextSymbol,
    handlePrev: () => navigateProblem(prevSymbol),
    handleNext: () => navigateProblem(nextSymbol),
    attemptsPage,
    attemptsPagination,
    onAttemptsPaginationChange,
    isAttemptsLoading,
    mutateAttempts,
    handleSubmit,
    isSubmitting: submission.isPending,
    isContestLocked,
    timeLeft,
    upsolveHref,
    canOpenOriginalProblem,
    showInitialSkeleton: !problem,
    isNotFound:
      !Number.isInteger(contestId) ||
      !contestId ||
      contestId <= 0 ||
      isNotFoundError(contestError) ||
      isNotFoundError(problemError),
    hasLoadError: (!problem && Boolean(problemError)) || (!contest && Boolean(contestError)),
    handleRetry: () => {
      void Promise.allSettled([mutateContest(), mutateProblem()]);
    },
    isProblemLoading,
    isRevalidating: Boolean(problem) && (isProblemLoading || isContestLoading),
  };
};
