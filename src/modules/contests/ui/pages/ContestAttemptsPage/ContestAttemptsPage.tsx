import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useAuth } from 'app/providers/AuthProvider';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import { getResourceByParams, resources } from 'app/routes/resources';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ProblemsAttemptsTable from 'modules/problems/ui/components/ProblemsAttemptsTable.tsx';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { useAttemptVerdicts, useAttemptsList } from 'modules/problems/application/queries';
import { useContest, useContestProblems } from 'modules/contests/application/queries';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';

interface AttemptsFilterState {
  contestProblem: string;
  verdict: string;
  userOnly: boolean;
}

const ContestAttemptsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const canLoadContestProblems = Boolean(contest && contest.statusCode !== ContestStatus.NotStarted);
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

  const { state: filter, patchState: patchFilterState, resetState: resetFilterState } =
    useRouteQueryState<AttemptsFilterState>({
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

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: paginationParams,
    setPaginationModel,
  } = useGridPagination({
    initialPageSize: 20,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
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
  }, [contestId, currentUser?.username, filter.contestProblem, filter.userOnly, filter.verdict, paginationParams.page, paginationParams.pageSize]);

  const { data: attemptsPage, isLoading, mutate } = useAttemptsList(requestParams);

  const handleFilterChange = <K extends keyof AttemptsFilterState>(key: K, value: AttemptsFilterState[K]) => {
    patchFilterState({ [key]: value } as Partial<AttemptsFilterState>);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    resetFilterState();
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const problemsOptions = useMemo(
    () =>
      contestProblems.map((problem: ContestProblemEntity) => ({
        value: problem.symbol,
        label: `${problem.symbol}. ${problem.problem.title}`,
      })),
    [contestProblems],
  );

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.attempts')}
        contest={contest as any}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>
          <ProblemsAttemptsTable
            attempts={attemptsPage?.data ?? []}
            total={attemptsPage?.total ?? 0}
            paginationModel={paginationModel}
            onPaginationChange={onPaginationModelChange}
            isLoading={isLoading}
            onRerun={() => mutate()}
            showProblemColumn
            getProblemLink={(attempt) =>
              getResourceByParams(resources.ContestProblem, {
                id: contest?.id ?? contestId ?? '',
                symbol: attempt.contestProblemSymbol ?? attempt.problemId?.toString() ?? '',
              })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>
            <ContestCountdownCard contest={contest} isLoading={isContestLoading} />

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {t('contests.filter.title')}
                  </Typography>

                  <Select
                    variant="standard"
                    value={filter.contestProblem}
                    onChange={(event) => handleFilterChange('contestProblem', event.target.value)}
                    size="small"
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">{t('contests.filter.anyProblem')}</MenuItem>
                    {problemsOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    variant="standard"
                    value={filter.verdict}
                    onChange={(event) => handleFilterChange('verdict', event.target.value)}
                    size="small"
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">{t('contests.filter.anyVerdict')}</MenuItem>
                    {verdictOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {currentUser ? (
                    <OnlyMeSwitch
                      label={t('contests.filter.onlyMe')}
                      checked={filter.userOnly}
                      onChange={(_, checked) => handleFilterChange('userOnly', checked)}
                    />
                  ) : null}

                  <Box display="flex" gap={1}>
                    <Button variant="outlined" fullWidth color="secondary" onClick={handleReset}>
                      {t('contests.filter.reset')}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestAttemptsPage;
