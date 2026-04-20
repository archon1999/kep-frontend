import { MouseEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
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
import { getResourceByUsername, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { useProblemSolvers } from 'modules/problems/application/queries.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';
import { ProblemSolver, ProblemSolversOrdering } from 'modules/problems/domain/entities/problem.entity';

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

  return dayjs(value).format('YYYY-MM-DD HH:mm');
};

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
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
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
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

  const columns = useMemo<GridColDef<ProblemSolver>[]>(
    () => [
      {
        field: 'username',
        headerName: t('problems.detail.user'),
        minWidth: 240,
        flex: 1.5,
        sortable: false,
        renderCell: ({ row }) => {
          const profileLink = getResourceByUsername(resources.UserProfile, row.username);

          return (
            <UserPopover username={row.username} avatar={row.avatar}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                component={RouterLink}
                to={profileLink}
                sx={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}
              >
                <Avatar src={row.avatar} alt={row.username} sx={{ width: 40, height: 40 }} />
                <Stack minWidth={0}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {row.username}
                  </Typography>
                  {row.ratingTitle ? (
                    <ContestsRatingChip title={row.ratingTitle} imgSize={18} />
                  ) : null}
                </Stack>
              </Stack>
            </UserPopover>
          );
        },
      },
      {
        field: 'rating',
        headerName: t('problems.rating.columns.rating'),
        minWidth: 120,
        flex: 0.55,
        sortable: false,
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color="secondary.main"
            sx={{ width: '100%', textAlign: 'right' }}
          >
            {row.rating ?? '--'}
          </Typography>
        ),
      },
      {
        field: 'latestSolvedAt',
        headerName: t('problems.detail.latestSolved'),
        minWidth: 170,
        flex: 0.8,
        sortable: false,
        renderCell: ({ row }) => (
          <Chip label={formatDateTime(row.latestSolvedAt)} size="small" variant="outlined" />
        ),
      },
      {
        field: 'attemptsToSolve',
        headerName: t('problems.detail.attemptsToSolve'),
        minWidth: 140,
        flex: 0.6,
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
        minWidth: 140,
        flex: 0.6,
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
      <Card
        sx={{
          overflow: 'hidden',
          color: 'common.white',
          background:
            'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
          boxShadow: '0 28px 56px rgba(15, 23, 42, 0.16)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={1}>
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.74)', letterSpacing: 1.1 }}
            >
              {t('problems.detail.solversTitle')}
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {t('problems.detail.solversTab')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {t('problems.detail.solversSubtitle')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={t('problems.detail.solversTab')}
            value={String(data?.total ?? 0)}
            subtitle={t('problems.detail.dataCockpitAudience')}
            icon="mdi:account-group"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={t('problems.detail.latestSolved')}
            value={latestSolver?.username ?? '--'}
            subtitle={
              latestSolver?.latestSolvedAt ? formatDateTime(latestSolver.latestSolvedAt) : undefined
            }
            icon="mdi:clock-outline"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={t('problems.detail.shortestCode')}
            value={shortestCodeOwner?.username ?? '--'}
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
                <Typography variant="body2" color="text.secondary">
                  {t('problems.detail.solversSubtitle')}
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

            {!isLoading && !data?.data?.length ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary">{t('problems.detail.noSolvers')}</Typography>
                </CardContent>
              </Card>
            ) : (
              <DataGrid
                autoHeight
                rows={data?.data ?? []}
                columns={columns}
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
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
