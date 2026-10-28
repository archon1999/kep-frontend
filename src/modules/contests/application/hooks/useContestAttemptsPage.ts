import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestProblems } from 'modules/contests/application/queries';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useAttemptVerdicts, useAttemptsList } from 'modules/problems/application/queries';
import { AttemptsListParams } from 'modules/problems/domain/contracts/problems.repository';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import { booleanFlagParam, stringParam } from 'shared/lib/queryParams';

interface AttemptsFilterState {
  contestProblem: string;
  verdict: string;
  userOnly: boolean;
}

export const useContestAttemptsPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const { currentUser } = useAuth();

  const { data: contest, isLoading: isContestLoading, error: contestError } = useContest(contestId);

  const canLoadContestProblems = Boolean(
    contest && contest.statusCode !== ContestStatus.NotStarted,
  );

  const { data: contestProblems = [] } = useContestProblems(
    contestId,
    undefined,
    canLoadContestProblems,
  );

  const { data: verdictOptions = [] } = useAttemptVerdicts();

  useDocumentTitle(
    contest?.title ? 'pageTitles.contestAttempts' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const {
    state: filter,
    patchFilters: patchFilterState,
    resetFilters: resetFilterState,
    paginationModel,
    onPaginationModelChange,
    pageParams: paginationParams,
  } = usePaginatedRouteState<AttemptsFilterState>({
    defaults: {
      contestProblem: '',
      verdict: '',
      userOnly: false,
    },
    schema: {
      contestProblem: {
        ...stringParam(),
        param: 'contestProblem',
      },
      verdict: {
        ...stringParam(),
        param: 'verdict',
      },
      userOnly: {
        ...booleanFlagParam(),
        param: 'onlyMe',
      },
    },
  });

  const requestParams = useMemo<AttemptsListParams>(() => {
    const verdictNumber = filter.verdict ? Number(filter.verdict) : NaN;
    return {
      contestId,
      contestProblem: filter.contestProblem || undefined,
      verdict: Number.isNaN(verdictNumber) ? undefined : verdictNumber,
      username: filter.userOnly && currentUser?.username ? currentUser.username : undefined,
      ordering: '-id',
      page: paginationParams.page,
      pageSize: paginationParams.pageSize,
    };
  }, [
    contestId,
    currentUser?.username,
    filter.contestProblem,
    filter.userOnly,
    filter.verdict,
    paginationParams.page,
    paginationParams.pageSize,
  ]);

  const {
    data: attemptsPage,
    isLoading,
    mutate,
    error: sectionError,
  } = useAttemptsList(requestParams);

  const handleFilterChange = <K extends keyof AttemptsFilterState>(
    key: K,
    value: AttemptsFilterState[K],
  ) => {
    patchFilterState({ [key]: value } as Partial<AttemptsFilterState>);
  };

  const handleReset = () => {
    resetFilterState();
  };

  const problemsOptions = useMemo(
    () =>
      contestProblems.map((problem: ContestProblemEntity) => ({
        value: problem.symbol,
        label: `${problem.symbol}. ${problem.problem.title}`,
      })),
    [contestProblems],
  );
  return {
    currentUser,
    contest,
    isContestLoading,
    contestError,
    verdictOptions,
    filter,
    paginationModel,
    onPaginationModelChange,
    attemptsPage,
    isLoading,
    mutate,
    sectionError,
    contestId,
    handleFilterChange,
    handleReset,
    problemsOptions,
  };
};
