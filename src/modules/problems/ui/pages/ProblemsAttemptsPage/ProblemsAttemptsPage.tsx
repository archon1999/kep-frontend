import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import {
  problemsQueries,
  useAttemptVerdicts,
  useAttemptsList,
  useProblemLanguages,
} from 'modules/problems/application/queries';
import type { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import { usersApiClient } from 'modules/users/data-access/api/users.client';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { enumParam, stringParam } from 'shared/lib/queryParams';
import useSWR from 'swr';
import ProblemsAttemptsFilterDrawer from './components/ProblemsAttemptsFilterDrawer.tsx';

export interface AttemptsFilterState {
  username: string;
  problemId: string;
  verdict: string;
  lang: string;
  testCaseNumber: string;
  testCaseNumberOperator: 'lt' | 'exact' | 'gt';
}

export type ProblemOption = {
  id: number;
  title: string;
};

export type UserOption = {
  username: string;
  fullName: string;
  avatar?: string;
};

const EMPTY_PROBLEM_OPTIONS: ProblemOption[] = [];
const EMPTY_USER_OPTIONS: UserOption[] = [];
const filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH;

const ProblemsAttemptsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const filterDrawer = useFilterDrawer();
  const {
    state: filter,
    patchState: patchFilterState,
    resetState: resetFilterState,
  } = useRouteQueryState<AttemptsFilterState>({
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
  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
      initialPageSize: 20,
      querySync: {
        pageKey: 'page',
        pageSizeKey: 'pageSize',
      },
    });
  const [problemInput, setProblemInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedProblemOption, setSelectedProblemOption] = useState<ProblemOption | null>(null);
  const [testCaseNumberInput, setTestCaseNumberInput] = useState(filter.testCaseNumber);
  const debouncedTestCaseNumber = useDebouncedValue(testCaseNumberInput, 1000);

  const requestParams = useMemo<AttemptsListParams>(() => {
    const problemId = filter.problemId.trim() ? Number(filter.problemId) : NaN;
    const verdict = filter.verdict.trim() ? Number(filter.verdict) : NaN;
    const testCaseNumber = filter.testCaseNumber.trim() ? Number(filter.testCaseNumber) : NaN;

    return {
      username: filter.username || undefined,
      problemId: Number.isNaN(problemId) ? undefined : problemId,
      verdict: Number.isNaN(verdict) ? undefined : verdict,
      lang: filter.lang || undefined,
      testCaseNumber: Number.isNaN(testCaseNumber) ? undefined : testCaseNumber,
      testCaseNumberOperator: Number.isNaN(testCaseNumber)
        ? undefined
        : filter.testCaseNumberOperator,
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: '-id',
    };
  }, [filter, pageParams.page, pageParams.pageSize]);

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
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    resetFilterState([
      'username',
      'problemId',
      'verdict',
      'lang',
      'testCaseNumber',
      'testCaseNumberOperator',
    ]);
    setSelectedProblemOption(null);
    setTestCaseNumberInput('');
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  useEffect(() => {
    setTestCaseNumberInput(filter.testCaseNumber);
  }, [filter.testCaseNumber]);

  useEffect(() => {
    if (debouncedTestCaseNumber === filter.testCaseNumber) return;
    if (debouncedTestCaseNumber !== testCaseNumberInput) return;

    patchFilterState({ testCaseNumber: debouncedTestCaseNumber });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [
    debouncedTestCaseNumber,
    filter.testCaseNumber,
    patchFilterState,
    setPaginationModel,
    testCaseNumberInput,
  ]);

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

  const problemSuggestionsFetcher = async ([, search]: [string, string]) => {
    const term = (search ?? '').trim();
    const pageResult = await problemsQueries.problemsRepository.list({
      search: term || undefined,
      page: 1,
      pageSize: 10,
      ordering: 'id',
    });
    return pageResult.data.map(
      (item): ProblemOption => ({
        id: item.id,
        title: item.title,
      }),
    );
  };

  const userSuggestionsFetcher = async ([, search]: [string, string]) => {
    const term = (search ?? '').trim();
    const response = await usersApiClient.list({
      page: 1,
      pageSize: 10,
      search: term || undefined,
    });
    return (response?.data ?? []).map(
      (item): UserOption => ({
        username: item.username ?? '',
        fullName: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim(),
        avatar: item.avatar ?? (item as any).photo,
      }),
    );
  };

  const { data: problemOptions = EMPTY_PROBLEM_OPTIONS } = useSWR(
    ['attempts-problem-options', problemInput],
    problemSuggestionsFetcher,
  );
  const { data: userOptions = EMPTY_USER_OPTIONS } = useSWR(
    ['attempts-user-options', userInput],
    userSuggestionsFetcher,
  );

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

  return (
    <FilterDrawerLayout
      open={filterDrawer.open}
      drawerWidth={filterDrawerWidth}
      drawer={
        <ProblemsAttemptsFilterDrawer
          open={filterDrawer.open}
          handleClose={filterDrawer.close}
          drawerWidth={filterDrawerWidth}
          filter={filter}
          languages={languages ?? []}
          verdictOptions={verdictOptions ?? []}
          problemOptions={problemOptions}
          userOptions={userOptions}
          selectedProblem={selectedProblem}
          selectedUser={selectedUser}
          testCaseNumberInput={testCaseNumberInput}
          hasActiveFilters={hasActiveFilters}
          onChange={handleFilterChange}
          onTestCaseNumberInputChange={setTestCaseNumberInput}
          onClear={handleReset}
          setSelectedProblemOption={setSelectedProblemOption}
          setProblemInput={setProblemInput}
          setUserInput={setUserInput}
        />
      }
    >
      <Stack direction="column" spacing={3} height={1}>
        <PageHeader
          title={t('problems.attempts.title')}
          breadcrumb={[
            { label: t('problems.title'), url: resources.Problems },
            { label: t('problems.attempts.title'), active: true },
          ]}
          actionComponent={
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ width: { xs: 1, sm: 'auto' } }}
            >
              <OnlyMeSwitch
                label={t('problems.attempts.onlyMy')}
                checked={isOnlyMyAttempts}
                sx={{ width: { xs: 1, sm: 'auto' } }}
                onChange={(_, checked) => {
                  if (!currentUser?.username) {
                    redirectToLogin();
                    return;
                  }
                  handleFilterChange('username', checked ? currentUser.username : '');
                }}
              />

              <Stack direction="row" spacing={1} sx={{ width: { xs: 1, sm: 'auto' } }}>
                <Tooltip title={t('problems.attempts.refresh')}>
                  <Button
                    variant="soft"
                    color="neutral"
                    onClick={() => mutate()}
                    aria-label={t('problems.attempts.refresh')}
                    sx={{ minWidth: 44, px: 1.25, flexShrink: 0 }}
                  >
                    <IconifyIcon icon="mdi:reload" width={18} height={18} />
                  </Button>
                </Tooltip>
                <FilterButton
                  id="attempts-filters-button"
                  onClick={filterDrawer.toggle}
                  aria-haspopup="true"
                  aria-expanded={filterDrawer.open ? 'true' : undefined}
                  aria-controls={filterDrawer.open ? 'attempts-filters-drawer' : undefined}
                  label={t('problems.filterTitle')}
                  badgeContent={activeFilterCount}
                  containerSx={{ flex: { xs: 1, sm: '0 0 auto' } }}
                  sx={{ width: { xs: 1, sm: 'auto' } }}
                />
              </Stack>
            </Stack>
          }
        />

        <Box sx={{ flex: 1, px: { xs: 2, sm: 3, md: 5 }}}>
          <ProblemsAttemptsTable
            attempts={attempts}
            total={total}
            paginationModel={paginationModel}
            onPaginationChange={onPaginationModelChange}
            isLoading={isLoading}
            onRerun={() => mutate()}
            isFiltered={Boolean(
              filter.username ||
              filter.problemId ||
              filter.verdict ||
              filter.lang ||
              filter.testCaseNumber,
            )}
          />
        </Box>
      </Stack>
    </FilterDrawerLayout>
  );
};

export default ProblemsAttemptsPage;
