import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Link,
  Menu,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
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
  isAcmStyle,
} from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { getDataGridNoRowsOverlaySlotProps } from 'shared/components/common/DataGridNoRowsOverlay';
import FilterButton from 'shared/components/common/FilterButton';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import useGridPagination from 'shared/hooks/useGridPagination';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestantResultsDialog from './ContestantResultsDialog';

const getStandingsRowId = (row: ContestantEntity) =>
  `${row.rowType ?? 'official'}-${row.id ?? row.username}-${row.virtualTime ?? ''}`;

const getPerformanceLabel = (row: ContestantEntity) =>
  row.rank === 1 ? '∞' : (row.performance ?? '—');

const getContestantProblemInfo = (row: ContestantEntity, problemSymbol: string) =>
  row.problemsInfo?.find((item) => item.problemSymbol === problemSymbol) ?? null;

const decodeRouteParam = (value?: string) => {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeUsername = (value?: string | null) => value?.trim().toLowerCase() ?? '';

const contestantMatchesUsername = (row: ContestantEntity, normalizedUsername: string) => {
  if (!normalizedUsername) {
    return false;
  }

  if (normalizeUsername(row.username) === normalizedUsername) {
    return true;
  }

  return Boolean(
    row.team?.members?.some((member) => normalizeUsername(member.username) === normalizedUsername),
  );
};

const ContestStandingsPage = () => {
  const { id, username: participantParam } = useParams<{ id: string; username?: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedContestant, setSelectedContestant] = useState<ContestantEntity | null>(null);
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const dataGridApiRef = useGridApiRef();
  const focusedParticipantRef = useRef<string | null>(null);
  const isCompactLayout = useMediaQuery('(max-width:600px)');
  const participantUsername = useMemo(() => decodeRouteParam(participantParam), [participantParam]);
  const normalizedParticipantUsername = normalizeUsername(participantUsername);

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
  const filtersOpen = Boolean(filtersAnchor);
  const activeFiltersCount = useMemo(
    () => Number(Boolean(selectedFilter)) + Number(followingOnly) + Number(officialOnly),
    [followingOnly, officialOnly, selectedFilter],
  );
  const shouldAutoLocateParticipant =
    Boolean(participantUsername) && !searchParams.has('page') && !searchParams.has('pageSize');

  const { data: standings, isLoading } = useContestStandings(
    contestId,
    {
      page: shouldAutoLocateParticipant ? undefined : pageParams.page,
      pageSize: shouldAutoLocateParticipant ? undefined : pageParams.pageSize,
      filter: selectedFilter || null,
      following: followingOnly,
      official: officialOnly,
      participant: participantUsername,
      pinCurrentUser: Boolean(currentUser?.username),
    },
    refreshInterval,
  );

  const contestants = useMemo(
    () =>
      mergePinnedRows(
        standings?.data ?? [],
        standings?.pinnedRows,
        (row) => getStandingsRowId(row),
      ),
    [standings?.data, standings?.pinnedRows],
  );
  const participantTarget = useMemo(() => {
    if (!normalizedParticipantUsername) {
      return null;
    }

    const rowIndex = contestants.findIndex((contestant) =>
      contestantMatchesUsername(contestant, normalizedParticipantUsername),
    );
    if (rowIndex < 0) {
      return null;
    }

    return {
      rowId: getStandingsRowId(contestants[rowIndex]),
      rowIndex,
    };
  }, [contestants, normalizedParticipantUsername]);
  const selectedContestantId =
    selectedContestant?.rowType !== 'upsolve' ? selectedContestant?.id : undefined;
  const acmScoreGroupRowClasses = useMemo(() => {
    const rowClasses = new Map<string, string>();

    if (!isAcmStyle(contest?.type)) {
      return rowClasses;
    }

    let lastPoints: string | null = null;
    let groupIndex = -1;

    contestants.forEach((contestant) => {
      if (contestant.rowType === 'upsolve') {
        return;
      }

      const points = formatContestPoints(contestant.points);
      if (points !== lastPoints) {
        groupIndex += 1;
        lastPoints = points;
      }

      if (groupIndex % 2 === 1) {
        rowClasses.set(getStandingsRowId(contestant), 'MuiDataGrid-row--scoreGroupMuted');
      }
    });

    return rowClasses;
  }, [contest?.type, contestants]);
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

  useEffect(() => {
    if (!participantTarget || isLoading) {
      return;
    }

    const focusKey = `${contestId ?? ''}-${participantTarget.rowId}-${standings?.page ?? ''}`;
    if (focusedParticipantRef.current === focusKey) {
      return;
    }
    focusedParticipantRef.current = focusKey;

    const animationFrame = window.requestAnimationFrame(() => {
      const api = dataGridApiRef.current;
      if (!api) {
        return;
      }

      api.scrollToIndexes({ rowIndex: participantTarget.rowIndex });
      api.setCellFocus(participantTarget.rowId, 'username');

      const rowElement = Array.from(
        document.querySelectorAll<HTMLElement>('[role="row"][data-id]'),
      ).find((element) => element.getAttribute('data-id') === participantTarget.rowId);

      rowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [contestId, dataGridApiRef, isLoading, participantTarget, standings?.page]);

  const problemMap = useMemo(
    () => new Map(contestProblems.map((problem) => [problem.symbol, problem])),
    [contestProblems],
  );

  const handleFiltersToggle = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchor((current) => (current ? null : event.currentTarget));
  };

  const handleFiltersClose = () => {
    setFiltersAnchor(null);
  };

  const resetStandingsPage = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleClearFilters = () => {
    setField('followingOnly', false);
    setField('officialOnly', false);
    setField('selectedFilter', '');
    resetStandingsPage();
  };

  const tabsRightContent = (
    <>
      <FilterButton
        id="contest-standings-filters-button"
        onClick={handleFiltersToggle}
        label={t('contests.filters.toggle')}
        badgeContent={activeFiltersCount}
        aria-haspopup="true"
        aria-expanded={filtersOpen ? 'true' : undefined}
        aria-controls={filtersOpen ? 'contest-standings-filters-menu' : undefined}
      />

      <Menu
        id="contest-standings-filters-menu"
        anchorEl={filtersAnchor}
        open={filtersOpen}
        onClose={handleFiltersClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          sx: {
            p: 2.5,
            width: { xs: 300, sm: 380 },
          },
        }}
      >
        <Stack direction="column" spacing={2.25}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:tune-variant" width={20} height={20} />
              <Typography variant="subtitle2" fontWeight={700}>
                {t('contests.filters.toggle')}
              </Typography>
            </Stack>
            <Button
              size="small"
              variant="text"
              color="secondary"
              disabled={activeFiltersCount === 0}
              onClick={handleClearFilters}
            >
              {t('contests.filter.reset')}
            </Button>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('contests.standings.followingOnly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={followingOnly}
                  onChange={(_, checked) => {
                    setField('followingOnly', checked);
                    resetStandingsPage();
                  }}
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('contests.standings.officialOnly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={officialOnly}
                  onChange={(_, checked) => {
                    setField('officialOnly', checked);
                    resetStandingsPage();
                  }}
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>

          <TextField
            select
            fullWidth
            variant="filled"
            size="small"
            label={t('contests.standings.allFilters')}
            value={selectedFilter}
            disabled={!contestFilters.length}
            onChange={(event) => {
              setField('selectedFilter', event.target.value);
              resetStandingsPage();
            }}
          >
            <MenuItem value="">
              <Typography variant="body2">{t('contests.standings.allFilters')}</Typography>
            </MenuItem>
            {contestFilters.map((filter) => (
              <MenuItem key={filter.id} value={String(filter.id)}>
                {filter.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Menu>
    </>
  );

  const columns: GridColDef<ContestantEntity>[] = useMemo(() => {
    const base: GridColDef<ContestantEntity>[] = [
      {
        field: 'rank',
        headerName: t('contests.standings.place'),
        minWidth: isCompactLayout ? 40 : 70,
        width: isCompactLayout ? 42 : undefined,
        flex: isCompactLayout ? undefined : 0.3,
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
        minWidth: isCompactLayout ? 128 : 200,
        flex: isCompactLayout ? 1 : 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <ContestantView
              contestant={row}
              imgSize={isCompactLayout ? 22 : 28}
              isVirtual={row.isVirtual}
              isUnrated={row.isUnrated}
              isOfficial={row.isOfficial}
              showCountry
              showFullName={!isCompactLayout}
              disablePopover
            />
          </Stack>
        ),
      },
      {
        field: 'points',
        headerName: t('contests.standings.points'),
        minWidth: isCompactLayout ? 58 : 60,
        width: isCompactLayout ? 64 : undefined,
        flex: isCompactLayout ? undefined : 0.8,
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
        minWidth: isCompactLayout ? 86 : 110,
        flex: isCompactLayout ? undefined : 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: () => (
          <Tooltip title={t('contests.standings.delta')} arrow>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
              }}
            >
              <IconifyIcon icon="mdi:delta" fontSize={20} />
            </Box>
          </Tooltip>
        ),
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
        minWidth: isCompactLayout ? 86 : 100,
        flex: isCompactLayout ? undefined : 0.7,
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
                {getPerformanceLabel(row)}
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
        minWidth: isCompactLayout ? 54 : 100,
        width: isCompactLayout ? 56 : undefined,
        headerAlign: 'center',
        flex: isCompactLayout ? undefined : 0.8,
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
                px: isCompactLayout ? 0.25 : 1.5,
                py: isCompactLayout ? 0.25 : 1,
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
                  sx={{
                    fontWeight: 700,
                    fontSize: isCompactLayout ? '0.75rem' : undefined,
                    lineHeight: isCompactLayout ? 1.1 : undefined,
                  }}
                >
                  {problem?.symbol ?? symbol}
                </Link>
              </Tooltip>
              {!isCompactLayout ? (
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
              ) : null}
            </Box>
          );
        },
        renderCell: ({ row }) => {
          const info = getContestantProblemInfo(row, problem.symbol);
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
    isCompactLayout,
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
        apiRef={dataGridApiRef}
        autoHeight
        rowHeight={isCompactLayout ? 42 : 72}
        columnHeaderHeight={isCompactLayout ? 38 : undefined}
        disableColumnMenu
        disableColumnFilter
        disableRowSelectionOnClick
        rows={contestants}
        columns={columns}
        columnVisibilityModel={
          isCompactLayout
            ? {
                delta: false,
                performance: false,
              }
            : undefined
        }
        localeText={{ noRowsLabel: t('common.dataGrid.noRows.contestStandings') }}
        slotProps={getDataGridNoRowsOverlaySlotProps({
          filtered: Boolean(activeFiltersCount || participantUsername),
        })}
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
        getRowId={getStandingsRowId}
        getRowClassName={({ row }) =>
          [
            row.username === currentUser?.username ? 'MuiDataGrid-row--current' : '',
            contestantMatchesUsername(row, normalizeUsername(currentUser?.username))
              ? 'MuiDataGrid-row--currentUser'
              : '',
            participantTarget?.rowId === getStandingsRowId(row)
              ? 'MuiDataGrid-row--participantTarget'
              : '',
            acmScoreGroupRowClasses.get(getStandingsRowId(row)) ?? '',
            row.rowType !== 'upsolve' && row.id ? 'MuiDataGrid-row--clickable' : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
        sx={(theme) => ({
          minWidth: 0,
          '& .MuiDataGrid-cell': {
            px: isCompactLayout ? 0.5 : undefined,
            fontSize: isCompactLayout ? '0.75rem' : undefined,
            lineHeight: isCompactLayout ? 1.2 : undefined,
          },
          '& .MuiDataGrid-columnHeader': {
            px: isCompactLayout ? 0.5 : undefined,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: isCompactLayout ? '0.75rem' : undefined,
          },
          '& .MuiDataGrid-columnHeader .MuiTypography-subtitle2': {
            fontSize: isCompactLayout ? '0.75rem' : undefined,
            lineHeight: isCompactLayout ? 1.1 : undefined,
          },
          '& .MuiDataGrid-columnHeader .MuiTypography-caption': {
            fontSize: isCompactLayout ? '0.62rem' : undefined,
            lineHeight: isCompactLayout ? 1 : undefined,
          },
          '& .MuiDataGrid-cell .MuiTypography-body2, & .MuiDataGrid-cell .MuiTypography-subtitle2':
            {
              fontSize: isCompactLayout ? '0.7rem' : undefined,
              lineHeight: isCompactLayout ? 1.1 : undefined,
            },
          '& .MuiDataGrid-cell .MuiTypography-caption': {
            fontSize: isCompactLayout ? '0.65rem' : undefined,
          },
          '& .MuiDataGrid-cell .MuiTypography-overline': {
            fontSize: isCompactLayout ? '0.66rem' : undefined,
            lineHeight: isCompactLayout ? 1.05 : undefined,
            letterSpacing: 0,
          },
          '& .MuiDataGrid-cell .contest-problem-result': {
            gap: isCompactLayout ? 0 : undefined,
          },
          '& .MuiDataGrid-cell .contest-problem-result-best': {
            borderRadius: isCompactLayout ? 1 : undefined,
            px: isCompactLayout ? 0.5 : undefined,
            py: isCompactLayout ? 0.25 : undefined,
          },
          '& .MuiDataGrid-row--scoreGroupMuted': {
            bgcolor: '#f7f7f7',
            ...theme.applyStyles('dark', {
              bgcolor: '#111418',
            }),
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: 'primary.lighter',
          },
          '& .MuiDataGrid-row--clickable': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row--participantTarget': {
            bgcolor: 'warning.lighter',
            outline: '2px solid',
            outlineColor: 'warning.main',
            outlineOffset: -2,
            animation: 'participantTargetPulse 1.6s ease-in-out 2',
            ...theme.applyStyles('dark', {
              bgcolor: 'rgba(255, 193, 7, 0.16)',
            }),
          },
          '@keyframes participantTargetPulse': {
            '0%, 100%': {
              boxShadow: 'inset 0 0 0 0 rgba(255, 193, 7, 0)',
            },
            '50%': {
              boxShadow: 'inset 0 0 0 999px rgba(255, 193, 7, 0.12)',
            },
          },
        })}
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
