import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';
import { toast } from 'sonner';
import {
  addFavoriteProblem,
  dislikeProblem,
  likeProblem,
  removeFavoriteProblem,
  submitProblemSolution,
} from '../mutations';
import {
  getNextProblemId,
  getPreviousProblemId,
  useAttemptsList,
  useProblemDetail,
} from '../queries';
import { getWorkspaceErrorMessage } from '../workspace-error';
import { useProblemWorkspace } from './useProblemWorkspace';
import { useProblemWorkspaceRoute } from './useProblemWorkspaceRoute';

export const useProblemDetailPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const { id } = useParams<{ id: string }>();
  const problemId = Number(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = Number(searchParams.get('study-plan'));
  const studyPlanId = Number.isFinite(plan) && plan > 0 ? plan : null;
  const route = useProblemWorkspaceRoute();
  const detail = useProblemDetail(Number.isFinite(problemId) ? problemId : undefined);
  // SWR keeps the previous response while fetching a new ID; it must never become the new editor's problem.
  const problem = detail.data?.id === problemId ? detail.data : undefined;
  const scope = `problem:${id}:${currentUser?.username ?? ''}`;
  const workspace = useProblemWorkspace({
    problem,
    scope,
    storageKey: problem ? `problem-${problem.id}-code` : null,
    allowAnswer: true,
  });
  const submission = useScopedAsyncTask(scope);
  const navigation = useScopedAsyncTask(scope);
  const favorite = useScopedAsyncTask(scope);
  const vote = useScopedAsyncTask(scope);
  const {
    data: attemptsPage,
    mutate: mutateAttempts,
    isLoading: isAttemptsLoading,
  } = useAttemptsList({
    problemId: problemId || undefined,
    username: route.myAttemptsOnly ? currentUser?.username : undefined,
    lang: route.attemptsLangFilter || undefined,
    verdict: route.attemptsVerdictFilter ? Number(route.attemptsVerdictFilter) : undefined,
    page: route.attemptsPagination.page + 1,
    pageSize: route.attemptsPagination.pageSize,
    ordering: '-id',
  });
  useDocumentTitle(
    problem ? 'pageTitles.problem' : undefined,
    problem ? { problemId: problem.id, problemTitle: problem.title ?? '' } : undefined,
  );
  const onError = (error: unknown) =>
    toast.error(getWorkspaceErrorMessage(error, t('problems.detail.error')));
  const requireUser = () => {
    if (currentUser) return true;
    redirectToLogin();
    return false;
  };
  const navigateProblem = (direction: 'previous' | 'next') => {
    if (!problem) return;
    return navigation.run(
      () =>
        direction === 'previous' ? getPreviousProblemId(problem.id) : getNextProblemId(problem.id),
      {
        onSuccess: (nextId) => {
          if (nextId)
            navigate(
              `${getResourceById(resources.Problem, nextId)}${studyPlanId ? `?study-plan=${studyPlanId}` : ''}`,
            );
        },
        onError,
      },
    );
  };
  const handleSubmit = () => {
    if (!requireUser() || !problem || !workspace.selectedLang || !workspace.codeRef.current) return;
    return submission.run(
      () =>
        submitProblemSolution(problem.id, {
          sourceCode: workspace.codeRef.current,
          lang: workspace.selectedLang,
        }),
      {
        onSuccess: async () => {
          toast.success(t('problems.detail.submitSuccess'));
          route.handleTabChange('attempts');
          await Promise.allSettled([mutateAttempts()]);
        },
        onError,
      },
    );
  };
  const handleFavoriteToggle = () => {
    if (!requireUser() || !problem) return;
    return favorite.run(
      async () => {
        await (problem.userInfo?.isFavorite
          ? removeFavoriteProblem(problem.id)
          : addFavoriteProblem(problem.id));
      },
      {
        onSuccess: async () => {
          await Promise.allSettled([detail.mutate()]);
        },
        onError,
      },
    );
  };
  const handleLikeDislike = (type: 'like' | 'dislike') => {
    if (!requireUser() || !problem) return;
    return vote.run(
      () => (type === 'like' ? likeProblem(problem.id) : dislikeProblem(problem.id)),
      {
        onSuccess: async () => {
          await Promise.allSettled([detail.mutate()]);
        },
        onError,
      },
    );
  };
  return {
    ...route,
    ...workspace,
    problem,
    problemId,
    currentUser,
    studyPlanId,
    attemptsPage,
    mutateAttempts,
    isAttemptsLoading,
    mutateProblem: detail.mutate,
    isProblemLoading: detail.isLoading,
    isRevalidating: Boolean(problem) && detail.isValidating,
    showInitialSkeleton: !problem,
    isNotFound: !Number.isInteger(problemId) || problemId <= 0 || isNotFoundError(detail.error),
    hasLoadError: !problem && Boolean(detail.error),
    handleRetry: () => {
      void Promise.allSettled([detail.mutate()]);
    },
    showAnswerForInputAction: Boolean(problem?.hasSolution && problem?.hasCheckInput),
    handlePrev: () => navigateProblem('previous'),
    handleNext: () => navigateProblem('next'),
    handleSubmit,
    isSubmitting: submission.isPending,
    handleFavoriteToggle,
    handleLikeDislike,
  };
};
