import { MouseEvent, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import { useProblemSolvers } from 'modules/problems/application/queries.ts';
import {
  ProblemSolver,
  ProblemSolversOrdering,
} from 'modules/problems/domain/entities/problem.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { formatMachineDateTime } from 'shared/lib/dateTime';
import { stringParam } from 'shared/lib/queryParams';

interface ProblemSolversTabProps {
  problemId: number;
}

const solverOrderingOptions: Array<{ value: ProblemSolversOrdering; labelKey: string }> = [
  { value: '-latest_solved_at', labelKey: 'problems.detail.solverSortLatest' },
  { value: '-rating', labelKey: 'problems.detail.solverSortRating' },
  { value: 'shortest_code_size', labelKey: 'problems.detail.solverSortShortestCode' },
];

const formatDateTime = (value?: string) => {
  if (!value) {
    return '--';
  }

  return formatMachineDateTime(value, 'isoDateTimeMinute');
};

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon: string;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)',
      },
    }}
  >
    <CardContent>
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Chip icon={<IconifyIcon icon={icon} />} label={title} size="small" variant="soft" />
        </Stack>
        <Box sx={{ minWidth: 0 }}>{value}</Box>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

export const ProblemSolversTab = ({ problemId }: ProblemSolversTabProps) => {
  const { t } = useTranslation();
  const { state, setField } = useRouteQueryState({
    defaults: {
      ordering: '-latest_solved_at',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'solversOrdering',
      },
    },
  });
  const ordering = state.ordering as ProblemSolversOrdering;
  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
      initialPageSize: 10,
      querySync: {
        pageKey: 'solversPage',
        pageSizeKey: 'solversPageSize',
      },
    });

  const { data, isLoading } = useProblemSolvers(problemId, {
    ordering,
    page: pageParams.page,
    pageSize: pageParams.pageSize,
  });
  const { data: latestSolvers } = useProblemSolvers(problemId, {
    ordering: '-latest_solved_at',
    page: 1,
    pageSize: 1,
  });
  const { data: shortestCodeSolvers } = useProblemSolvers(problemId, {
    ordering: 'shortest_code_size',
    page: 1,
    pageSize: 1,
  });

  const latestSolver = latestSolvers?.data?.[0];
  const shortestCodeOwner = shortestCodeSolvers?.data?.[0];
  const renderSummarySolver = (solver?: ProblemSolver) =>
    solver ? (
      <ContestantView
        contestant={solver}
        imgSize={22}
        showFullName={false}
        sx={{
          minWidth: 0,
          '& .MuiTypography-root': {
            fontSize: { xs: 18, md: 22 },
            fontWeight: 700,
          },
        }}
      />
    ) : (
      <Typography variant="h5" fontWeight={700}>
        --
      </Typography>
    );

  const columns = useMemo<GridColDef<ProblemSolver>[]>(
    () => [
      {
        field: 'username',
        headerName: t('problems.detail.user'),
        minWidth: 160,
        flex: 1.1,
        sortable: false,
        renderCell: ({ row }) => {
          return (
            <UserPopover username={row.username} avatar={row.avatar}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{
                  color: 'inherit',
                  minWidth: 0,
                  maxWidth: '100%',
                  cursor: 'pointer',
                }}
              >
                <Avatar src={row.avatar} alt={row.username} sx={{ width: 32, height: 32 }} />
                <ContestantView
                  contestant={row}
                  imgSize={24}
                  showFullName={false}
                  showRating={false}
                  disablePopover
                  sx={{ minWidth: 0 }}
                />
              </Stack>
            </UserPopover>
          );
        },
      },
      {
        field: 'rating',
        headerName: t('problems.rating.columns.rating'),
        minWidth: 105,
        flex: 0.55,
        sortable: false,
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
          >
            {row.ratingTitle ? <ContestsRatingChip title={row.ratingTitle} imgSize={18} /> : null}
            <Typography variant="body2" fontWeight={700} color="secondary.main">
              {row.rating ?? '--'}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'latestSolvedAt',
        headerName: t('problems.detail.latestSolved'),
        minWidth: 145,
        flex: 0.75,
        sortable: false,
        renderCell: ({ row }) => (
          <Chip label={formatDateTime(row.latestSolvedAt)} size="small" variant="outlined" />
        ),
      },
      {
        field: 'attemptsToSolve',
        headerName: t('problems.detail.attemptsToSolve'),
        minWidth: 112,
        flex: 0.55,
        sortable: false,
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700} sx={{ width: '100%', textAlign: 'right' }}>
            {row.attemptsToSolve ?? '--'}
          </Typography>
        ),
      },
      {
        field: 'shortestCodeSize',
        headerName: t('problems.detail.shortestCode'),
        minWidth: 110,
        flex: 0.55,
        sortable: false,
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color="warning.main"
            sx={{ width: '100%', textAlign: 'right' }}
          >
            {row.shortestCodeSize !== undefined ? `${row.shortestCodeSize} B` : '--'}
          </Typography>
        ),
      },
    ],
    [t],
  );

  const handleOrderingChange = (
    _: MouseEvent<HTMLElement>,
    value: ProblemSolversOrdering | null,
  ) => {
    if (!value) {
      return;
    }

    setField('ordering', value);
    setPaginationModel((prev: GridPaginationModel) => ({ ...prev, page: 0 }));
  };

  return (
    <Stack spacing={2.5} sx={{ mt: 2 }}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={t('problems.detail.solversTab')}
            value={
              <Typography variant="h4" fontWeight={800}>
                {data?.total ?? 0}
              </Typography>
            }
            subtitle={t('users.title')}
            icon="mdi:account-group"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={t('problems.detail.latestSolved')}
            value={renderSummarySolver(latestSolver)}
            subtitle={
              latestSolver?.latestSolvedAt ? formatDateTime(latestSolver.latestSolvedAt) : undefined
            }
            icon="mdi:clock-outline"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={t('problems.detail.shortestCode')}
            value={renderSummarySolver(shortestCodeOwner)}
            subtitle={
              shortestCodeOwner?.shortestCodeSize !== undefined
                ? `${shortestCodeOwner.shortestCodeSize} B`
                : undefined
            }
            icon="mdi:code-tags"
          />
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {t('problems.detail.solversTab')}
                </Typography>
              </Box>

              <ToggleButtonGroup
                exclusive
                size="small"
                color="primary"
                value={ordering}
                onChange={handleOrderingChange}
              >
                {solverOrderingOptions.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            {isLoading ? <LinearProgress /> : null}

            <DataGrid
              autoHeight
              rows={data?.data ?? []}
              columns={columns}
              localeText={{ noRowsLabel: t('common.dataGrid.noRows.problemSolvers') }}
              loading={isLoading}
              rowCount={data?.total ?? 0}
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              pageSizeOptions={[10, 20, 50]}
              paginationMode="server"
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              getRowHeight={() => 72}
              getRowId={(row) => row.userId || row.username}
              sx={{
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
                '& .MuiDataGrid-cell': { outline: 'none' },
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
