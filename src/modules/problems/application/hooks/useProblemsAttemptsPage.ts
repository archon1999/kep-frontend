import { useMemo, useState } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import {
  useAttemptVerdicts,
  useAttemptsList,
  useProblemLanguages,
  useProblemSuggestions,
} from 'modules/problems/application/queries';
import { useUserSuggestions } from 'modules/users/application/queries';
import useDebouncedInput from 'shared/hooks/useDebouncedInput';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { enumParam, stringParam } from 'shared/lib/queryParams';
import {
  type AttemptsFilterState,
  type ProblemOption,
  type UserOption,
  buildAttemptsListParams,
} from '../attempts-filters';

const EMPTY_PROBLEM_OPTIONS: ProblemOption[] = [];
const EMPTY_USER_OPTIONS: UserOption[] = [];
export const useProblemsAttemptsPage = () => {
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const {
    state: filter,
    patchFilters: patchFilterState,
    resetFilters: resetFilterState,
    paginationModel,
    onPaginationModelChange,
    pageParams,
  } = usePaginatedRouteState<AttemptsFilterState>({
    defaults: {
      username: '',
      problemId: '',
      verdict: '',
      lang: '',
      testCaseNumber: '',
      testCaseNumberOperator: 'exact',
    },
    schema: {
      username: {
        ...stringParam(),
        param: 'username',
      },
      problemId: {
        ...stringParam(),
        param: 'problemId',
      },
      verdict: {
        ...stringParam(),
        param: 'verdict',
      },
      lang: {
        ...stringParam(),
        param: 'lang',
      },
      testCaseNumber: {
        ...stringParam(),
        param: 'testCaseNumber',
      },
      testCaseNumberOperator: {
        ...enumParam(['lt', 'exact', 'gt'] as const),
        param: 'testCaseNumberOperator',
      },
    },
  });
  const [problemInput, setProblemInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedProblemOption, setSelectedProblemOption] = useState<ProblemOption | null>(null);
  const testCaseInput = useDebouncedInput(
    filter.testCaseNumber,
    (testCaseNumber) => patchFilterState({ testCaseNumber }),
    1000,
  );

  const requestParams = useMemo(
    () => buildAttemptsListParams(filter, pageParams),
    [filter, pageParams],
  );

  const { data: attemptsPage, isLoading, mutate } = useAttemptsList(requestParams);
  const { data: languages } = useProblemLanguages();
  const { data: verdictOptions } = useAttemptVerdicts();

  const attempts = attemptsPage?.data ?? [];
  const total = attemptsPage?.total ?? 0;

  const handleFilterChange = <K extends keyof AttemptsFilterState>(
    key: K,
    value: AttemptsFilterState[K],
  ) => {
    patchFilterState({ [key]: value } as Partial<AttemptsFilterState>);
  };

  const handleReset = () => {
    testCaseInput.setValue('');
    resetFilterState();
    setSelectedProblemOption(null);
  };

  const isOnlyMyAttempts = Boolean(
    currentUser?.username && filter.username === currentUser.username,
  );
  const activeFilterCount = [
    Boolean(filter.username && filter.username !== currentUser?.username),
    Boolean(filter.problemId),
    Boolean(filter.verdict),
    Boolean(filter.lang),
    Boolean(filter.testCaseNumber),
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  const { data: problemOptions = EMPTY_PROBLEM_OPTIONS } = useProblemSuggestions(problemInput);
  const { data: userOptions = EMPTY_USER_OPTIONS } = useUserSuggestions(userInput);

  const selectedProblem = useMemo(
    () =>
      problemOptions.find((option) => String(option.id) === filter.problemId) ??
      (selectedProblemOption && String(selectedProblemOption.id) === filter.problemId
        ? selectedProblemOption
        : null) ??
      (filter.problemId
        ? {
            id: Number(filter.problemId),
            title: `${filter.problemId}`,
          }
        : null),
    [filter.problemId, problemOptions, selectedProblemOption],
  );

  const selectedUser = useMemo(() => {
    if (!filter.username) return null;
    return (
      userOptions.find((option) => option.username === filter.username) ?? {
        username: filter.username,
        fullName: '',
        avatar: '',
      }
    );
  }, [userOptions, filter.username]);

  const onOnlyMineChange = (checked: boolean) => {
    if (!currentUser?.username) {
      redirectToLogin();
      return;
    }
    handleFilterChange('username', checked ? currentUser.username : '');
  };
  return {
    filter,
    languages,
    verdictOptions,
    problemOptions,
    userOptions,
    selectedProblem,
    selectedUser,
    testCaseNumberInput: testCaseInput.value,
    hasActiveFilters,
    handleFilterChange,
    setTestCaseNumberInput: testCaseInput.setValue,
    handleReset,
    setSelectedProblemOption,
    setProblemInput,
    setUserInput,
    isOnlyMyAttempts,
    onOnlyMineChange,
    mutate,
    activeFilterCount,
    attempts,
    total,
    paginationModel,
    onPaginationModelChange,
    isLoading,
    isFiltered: Boolean(
      filter.username || filter.problemId || filter.verdict || filter.lang || filter.testCaseNumber,
    ),
  };
};
