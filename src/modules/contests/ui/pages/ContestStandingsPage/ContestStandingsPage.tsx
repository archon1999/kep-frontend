import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Chip,
  FormControl,
  Link,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import {
  useContest,
  useContestFilters,
  useContestProblems,
  useContestStandings,
} from 'modules/contests/application/queries';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestStandingsCountdown from 'modules/contests/ui/shared/components/ContestStandingsCountdown';
import ContestantProblemResultCell from 'modules/contests/ui/shared/components/ContestantProblemResultCell';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import {
  contestHasPenalties,
  contestUsesRating,
  formatContestPoints,
} from 'modules/contests/ui/shared/utils/contestType';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestantResultsDialog from './ContestantResultsDialog';

const ContestStandingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedContestant, setSelectedContestant] = useState<ContestantEntity | null>(null);

  const refreshInterval = 30000;

  const { data: contest, isLoading: isContestLoading } = useContest(contestId, {
    refreshInterval,
  });
  const canLoadContestProblems = Boolean(
    contest && contest.statusCode !== ContestStatus.NotStarted,
  );
  const { data: contestProblems = [] } = useContestProblems(
    contestId,
    {
      refreshInterval,
    },
    canLoadContestProblems,
  );
  const { data: contestFilters = [] } = useContestFilters(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestStandings' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
      initialPageSize: 20,
      querySync: {
        pageKey: 'page',
        pageSizeKey: 'pageSize',
      },
    });
  const { state, setField } = useRouteQueryState({
    defaults: {
      selectedFilter: '',
      followingOnly: false,
      officialOnly: false,
    },
    schema: {
      selectedFilter: {
        ...stringParam(),
        param: 'filter',
      },
      followingOnly: {
        ...booleanFlagParam(),
        param: 'following',
      },
      officialOnly: {
        ...booleanFlagParam(),
        param: 'official',
      },
    },
  });
  const selectedFilter = state.selectedFilter;
  const followingOnly = state.followingOnly;
  const officialOnly = state.officialOnly;

  const { data: standings, isLoading } = useContestStandings(
    contestId,
    {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      filter: selectedFilter || null,
      following: followingOnly,
      official: officialOnly,
    },
    refreshInterval,
  );

  const contestants = standings?.data ?? [];
  const selectedContestantId =
    selectedContestant?.rowType !== 'upsolve' ? selectedContestant?.id : undefined;
  const rowCountRef = useRef(0);
  const total = useMemo(() => {
    if (standings?.total !== undefined) {
      rowCountRef.current = standings.total;
    }

    return rowCountRef.current;
  }, [standings?.total]);

  useEffect(() => {
    if (searchParams.has('page') || !standings?.page || standings.page === pageParams.page) {
      return;
    }

    setPaginationModel((prev) => ({
      ...prev,
      page: Math.max(standings.page - 1, 0),
    }));
  }, [pageParams.page, searchParams, setPaginationModel, standings?.page]);

  const problemMap = useMemo(
    () => new Map(contestProblems.map((problem) => [problem.symbol, problem])),
    [contestProblems],
  );
  const tabsRightContent = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          size="small"
          checked={followingOnly}
          onChange={(_, checked) => {
            setField('followingOnly', checked);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
        />
        <Typography variant="body2" fontWeight={600}>
          {t('contests.standings.followingOnly')}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          size="small"
          checked={officialOnly}
          onChange={(_, checked) => {
            setField('officialOnly', checked);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
        />
        <Typography variant="body2" fontWeight={600}>
          {t('contests.standings.officialOnly')}
        </Typography>
      </Stack>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          variant="standard"
          labelId="contest-standings-filter-select"
          label={t('contests.standings.allFilters')}
          value={selectedFilter}
          disabled={!contestFilters.length}
          onChange={(event) => {
            setField('selectedFilter', event.target.value);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          displayEmpty
          renderValue={(value) =>
            value
              ? (contestFilters.find((f) => String(f.id) === String(value))?.name ??
                t('contests.standings.allFilters'))
              : t('contests.standings.allFilters')
          }
        >
          <MenuItem value="">
            <Typography variant="body2">{t('contests.standings.allFilters')}</Typography>
          </MenuItem>
          {contestFilters.map((filter) => (
            <MenuItem key={filter.id} value={String(filter.id)}>
              {filter.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );

  const columns: GridColDef<ContestantEntity>[] = useMemo(() => {
    const base: GridColDef<ContestantEntity>[] = [
      {
        field: 'rank',
        headerName: t('contests.standings.place'),
        minWidth: 70,
        flex: 0.3,
        sortable: false,
        renderHeader: (params) => (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1 }}>
            <Typography variant="subtitle2" fontWeight={500} color="text.primary">
              {params.colDef.headerName}
            </Typography>
          </Stack>
        ),
        renderCell: ({ row }) =>
          row.rowType === 'upsolve' ? null : (
            <Typography variant="body2" fontWeight={700}>
              {row.rank ?? '—'}
            </Typography>
          ),
      },
      {
        field: 'username',
        headerName: t('contests.standings.contestant'),
        minWidth: 200,
        flex: 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <ContestantView
              contestant={row}
              imgSize={28}
              isVirtual={row.isVirtual}
              isUnrated={row.isUnrated}
              isOfficial={row.isOfficial}
              showCountry
            />
          </Stack>
        ),
      },
      {
        field: 'points',
        headerName: t('contests.standings.points'),
        minWidth: 60,
        flex: 0.8,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={800} color="primary.main">
              {row.points === undefined || row.points === null
                ? '-'
                : formatContestPoints(row.points)}
            </Typography>
            {row.rowType !== 'upsolve' && contestHasPenalties(contest?.type, contest?.typeInfo) ? (
              <Typography variant="caption" color="error.main">
                ({row.penalties ?? 0})
              </Typography>
            ) : null}
          </Stack>
        ),
      },
    ];

    if (contestUsesRating(contest?.type, contest?.isRated)) {
      base.push({
        field: 'delta',
        headerName: t('contests.standings.delta'),
        minWidth: 110,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
          if (row.rowType === 'upsolve' || row.isVirtual) {
            return (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            );
          }

          const deltaValue = row.delta ?? 0;
          const deltaLabel = `${deltaValue > 0 ? '+' : ''}${deltaValue}`;

          return (
            <Chip
              label={deltaLabel}
              color={
                row.delta && row.delta > 0
                  ? 'success'
                  : row.delta && row.delta < 0
                    ? 'error'
                    : 'default'
              }
              size="small"
              variant="outlined"
            />
          );
        },
      });

      base.push({
        field: 'performance',
        headerName: t('contests.standings.performance'),
        minWidth: 100,
        flex: 0.7,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) =>
          row.rowType === 'upsolve' || row.isVirtual ? (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ) : (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {row.performance ?? '—'}
              </Typography>
              {row.performanceTitle ? (
                <ContestsRatingChip title={row.performanceTitle} imgSize={22} />
              ) : null}
            </Stack>
          ),
      });
    }

    const problemColumns: GridColDef<ContestantEntity>[] = contestProblems.map(
      (problem: ContestProblemEntity) => ({
        field: `problem-${problem.symbol}`,
        headerName: problem.symbol,
        minWidth: 100,
        headerAlign: 'center',
        flex: 0.8,
        sortable: false,
        renderHeader: (params) => {
          const symbol = params.colDef.field.replace('problem-', '');
          const problem = problemMap.get(symbol);
          const problemLink = contestId
            ? getResourceByParams(resources.ContestProblem, { id: contestId, symbol })
            : '#';

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1.5,
                py: 1,
                borderRight: 1,
                borderColor: 'divider',
                '&:last-of-type': { borderRight: 'none' },
              }}
            >
              <Tooltip title={problem?.problem.title ?? ''} arrow>
                <Link
                  component={RouterLink}
                  to={problemLink}
                  underline="hover"
                  color="text.primary"
                  sx={{ fontWeight: 700 }}
                >
                  {problem?.symbol ?? symbol}
                </Link>
              </Tooltip>
              <Stack direction="row" spacing={0.4} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  (
                </Typography>
                <Typography variant="caption" color="success.main">
                  {problem?.solved ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /
                </Typography>
                <Typography variant="caption" color="error.main">
                  {problem?.unsolved ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {problem?.attemptsCount ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  )
                </Typography>
              </Stack>
            </Box>
          );
        },
        renderCell: ({ row }) => {
          const info =
            row.problemsInfo?.find((item) => item.problemSymbol === problem.symbol) ?? null;
          return (
            <ContestantProblemResultCell
              contestType={contest?.type}
              typeInfo={contest?.typeInfo}
              info={info}
              problem={problem}
              rowType={row.rowType}
            />
          );
        },
      }),
    );

    return [...base, ...problemColumns];
  }, [
    contest?.id,
    contest?.isRated,
    contest?.type,
    contest?.typeInfo,
    contestId,
    contestProblems,
    problemMap,
    t,
  ]);

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.standings')}
        contest={contest as any}
        contestId={contestId}
        isRated={contestUsesRating(contest?.type, contest?.isRated)}
        tabsRightContent={tabsRightContent}
        showLogoOverlay
        isLoading={isContestLoading}
      />

      {contest ? <ContestStandingsCountdown contest={contest} /> : null}

      <DataGrid
        autoHeight
        rowHeight={72}
        disableColumnMenu
        disableColumnFilter
        disableRowSelectionOnClick
        rows={contestants}
        columns={columns}
        loading={isLoading}
        rowCount={total}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50, 100]}
        onRowClick={({ row }) => {
          if (row.rowType === 'upsolve' || !row.id) {
            return;
          }

          setSelectedContestant(row);
        }}
        getRowId={(row) =>
          `${row.rowType ?? 'official'}-${row.id ?? row.username}-${row.virtualTime ?? ''}`
        }
        getRowClassName={({ row }) =>
          [
            row.username === currentUser?.username ? 'MuiDataGrid-row--current' : '',
            row.rowType !== 'upsolve' && row.id ? 'MuiDataGrid-row--clickable' : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
        sx={{
          '& .MuiDataGrid-row--clickable': {
            cursor: 'pointer',
          },
        }}
      />

      <ContestantResultsDialog
        open={Boolean(selectedContestantId)}
        onClose={() => setSelectedContestant(null)}
        contestId={contestId}
        contestantId={selectedContestantId}
        contestant={selectedContestant}
        showPenalties={contestHasPenalties(contest?.type, contest?.typeInfo)}
      />
    </Stack>
  );
};

export default ContestStandingsPage;
