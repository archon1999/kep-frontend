import { useMemo } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useDuelsRating } from 'modules/duels/application/queries.ts';
import { DuelsRatingPageTableRow } from 'modules/duels/domain/index.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import { mergePinnedRows, rowMatchesUsername } from 'shared/lib/pinnedRows';
import { stringParam } from 'shared/lib/queryParams';
import { mapDuelsRatingPageTableRows } from 'modules/duels/data-access/mappers/duels-rating-page.mapper.ts';

const DuelsRatingPageTable = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  const { state } = useRouteQueryState({
    defaults: {
      ordering: '-wins',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });
  const ordering = state.ordering || '-wins';
  const { data: ratingPage, isLoading } = useDuelsRating({
    page,
    pageSize,
    ordering,
    pinCurrentUser: Boolean(currentUser?.username),
  });
  const rows = useMemo(
    () =>
      mapDuelsRatingPageTableRows(
        mergePinnedRows(
          ratingPage?.data ?? [],
          ratingPage?.pinnedRows,
          (row) => row.user.username,
        ),
      ),
    [ratingPage?.data, ratingPage?.pinnedRows],
  );
  const rowCount = useStableGridRowCount(ratingPage?.total, isLoading);

  const columns: GridColDef<DuelsRatingPageTableRow>[] = useMemo(
    () => [
      {
        field: 'rowIndex',
        headerName: t('duels.table.place'),
        width: 88,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: ({ value }) => (
          <Typography variant="subtitle1" fontWeight={900}>
            #{value}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('duels.table.username'),
        flex: 1.2,
        minWidth: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <UserPopover username={row.username} avatar={row.avatar}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar src={row.avatar} alt={row.username} sx={{ width: 42, height: 42 }} />
              <Typography variant="subtitle2" fontWeight={800} noWrap>
                {row.username}
              </Typography>
            </Stack>
          </UserPopover>
        ),
      },
      {
        field: 'contestsRating',
        headerName: t('duels.table.contestsRating'),
        flex: 1,
        minWidth: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <ContestsRatingChip title={row.contestsRatingTitle} imgSize={26} />
            <Stack spacing={0.1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={800}>
                {row.contestsRating ?? '--'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'capitalize' }}
                noWrap
              >
                {row.contestsRatingTitle ?? '--'}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'record',
        headerName: t('duels.table.record'),
        flex: 1,
        minWidth: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack spacing={0.35}>
            <Typography variant="subtitle2" fontWeight={800}>
              {row.duels} {t('duels.table.duels').toLowerCase()}
            </Typography>
            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" rowGap={0.5}>
              <Typography color="success.main">{row.wins}W</Typography>
              <Typography color="text.secondary">{row.draws}D</Typography>
              <Typography color="error.main">{row.losses}L</Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [t],
  );

  return (
    <DataGrid
      autoHeight
      disableRowSelectionOnClick
      loading={isLoading}
      rows={rows}
      columns={columns}
      getRowClassName={({ row }) =>
        rowMatchesUsername(row, currentUser?.username) ? 'MuiDataGrid-row--currentUser' : ''
      }
      localeText={{ noRowsLabel: t('common.dataGrid.noRows.duelsRating') }}
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      paginationMode="server"
      pageSizeOptions={[10]}
      disableColumnMenu
      disableColumnFilter
      disableColumnSelector
      getRowHeight={() => 78}
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 800,
        },
      }}
    />
  );
};

export default DuelsRatingPageTable;
