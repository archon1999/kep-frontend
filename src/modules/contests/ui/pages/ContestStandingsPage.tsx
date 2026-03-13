import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Chip, FormControl, Link, MenuItem, Select, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import { getResourceByParams, resources } from 'app/routes/resources';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import {
  useContest,
  useContestFilters,
  useContestProblems,
  useContestStandings,
} from '../../application/queries';
import { ContestProblemEntity } from '../../domain/entities/contest-problem.entity';
import { ContestantEntity } from '../../domain/entities/contestant.entity';
import { contestHasBalls, contestHasPenalties, isAcmStyle } from '../../utils/contestType';
import ContestPageHeader from '../components/ContestPageHeader';
import ContestStandingsCountdown from '../components/ContestStandingsCountdown';
import ContestantView from '../components/ContestantView';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';

const formatProblemResult = (contestType: ContestType | undefined, info: any) => {
  if (!info) {
    return { label: '-', color: 'default' as const, helper: '' };
  }

  if (isAcmStyle(contestType)) {
    if (info.firstAcceptedTime) {
      const attempts = info.attemptsCount > 0 ? `+${info.attemptsCount}` : '+';
      return {
        label: attempts,
        color: 'success' as const,
        helper: info.contestTime ?? '',
        isBest: info.theBest,
      };
    }
    if (info.attemptsCount > 0) {
      return { label: `-${info.attemptsCount}`, color: 'error' as const };
    }
    return { label: '-', color: 'default' as const };
  }

  if (contestType === ContestType.LessCode || contestType === ContestType.DC) {
    if (info.firstAcceptedTime) {
      return { label: `${info.points}`, color: 'success' as const, isBest: info.theBest };
    }
    return { label: '-', color: 'error' as const };
  }

  if (contestType === ContestType.LessLine) {
    if (info.firstAcceptedTime) {
      return { label: `${info.points}/10`, color: 'primary' as const, isBest: info.theBest };
    }
    return { label: '-', color: 'error' as const };
  }

  if (contestType === ContestType.MultiL) {
    if (info.firstAcceptedTime) {
      return { label: `${info.points}/10`, color: 'info' as const, isBest: info.theBest };
    }
    return { label: '-', color: 'error' as const };
  }

  if (contestHasBalls(contestType)) {
    if (info.firstAcceptedTime) {
      return {
        label: info.points ?? '',
        color: 'primary' as const,
        helper: info.contestTime ?? '',
        isBest: info.theBest,
      };
    }
    if (info.points > 0) {
      return { label: info.points, color: 'warning' as const };
    }
    return { label: info.points ?? '-', color: 'error' as const };
  }

  return { label: '-', color: 'default' as const };
};

const ContestStandingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const refreshInterval = 30000;

  const { data: contest, isLoading: isContestLoading } = useContest(contestId, {
    refreshInterval,
  });
  const { data: contestProblems = [] } = useContestProblems(contestId, {
    refreshInterval,
  });
  const { data: contestFilters = [] } = useContestFilters(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestStandings' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams,
    setPaginationModel,
  } = useGridPagination({ initialPageSize: 20 });
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [followingOnly, setFollowingOnly] = useState(false);

  const { data: standings, isLoading } = useContestStandings(
    contestId,
    {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      filter: selectedFilter || null,
      following: followingOnly,
    },
    refreshInterval,
  );

  const contestants = standings?.data ?? [];
  const total = standings?.total ?? 0;
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
            setFollowingOnly(checked);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
        />
        <Typography variant="body2" fontWeight={600}>
          {t('contests.standings.followingOnly')}
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
            setSelectedFilter(event.target.value);
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
        renderCell: ({ row }) => (
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
          <ContestantView
            contestant={row}
            imgSize={28}
            isVirtual={row.isVirtual}
            isUnrated={row.isUnrated}
            isOfficial={row.isOfficial}
            showCountry
          />
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
              {row.points ?? '—'}
            </Typography>
            {contestHasPenalties(contest?.type) ? (
              <Typography variant="caption" color="error.main">
                ({row.penalties ?? 0})
              </Typography>
            ) : null}
          </Stack>
        ),
      },
    ];

    if (contest?.isRated) {
      base.push({
        field: 'delta',
        headerName: t('contests.standings.delta'),
        minWidth: 110,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
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
        renderCell: ({ row }) => (
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
          const result = formatProblemResult(contest?.type, info);
          return (
            info && (
              <Stack spacing={0.25} alignItems="center" width="100%">
                {result.isBest && (
                  <Stack
                    spacing={0.25}
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="success.lighter"
                    sx={{ borderRadius: 2, py: 0.5, px: 0.75 }}
                  >
                    <Typography variant="subtitle2" color={result.color}>
                      {result.label}
                    </Typography>
                    {result.helper ? (
                      <Typography variant="overline" fontWeight={500}>
                        {result.helper}
                      </Typography>
                    ) : null}
                  </Stack>
                )}
                {!result.isBest && (
                  <>
                    <Typography variant="subtitle2" color={result.color}>
                      {result.label}
                    </Typography>
                    {result.helper ? (
                      <Typography variant="overline" fontWeight={500}>
                        {result.helper}
                      </Typography>
                    ) : null}
                  </>
                )}
              </Stack>
            )
          );
        },
      }),
    );

    return [...base, ...problemColumns];
  }, [contest?.id, contest?.isRated, contest?.type, contestId, contestProblems, problemMap, t]);

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.standings')}
        contest={contest as any}
        contestId={contestId}
        isRated={contest?.isRated}
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
        getRowId={(row) => `${row.username}-${row.virtualTime ?? ''}`}
        getRowClassName={({ row }) =>
          row.username === currentUser?.username ? 'MuiDataGrid-row--current' : ''
        }
      />
    </Stack>
  );
};

export default ContestStandingsPage;
