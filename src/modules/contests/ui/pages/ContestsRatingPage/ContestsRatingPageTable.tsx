import { useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { useTranslation } from 'react-i18next';
import { ContestRatingRow } from 'modules/contests/domain/entities/contest-rating.entity';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import { rowMatchesUsername } from 'shared/lib/pinnedRows';

export type ContestsRatingPageRow = GridValidRowModel & ContestRatingRow;

type ContestsRatingPageTableProps = {
  rows: ContestsRatingPageRow[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  currentUsername?: string;
};

const ContestsRatingPageTable = ({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  currentUsername,
}: ContestsRatingPageTableProps) => {
  const { t } = useTranslation();

  const columns: GridColDef<ContestsRatingPageRow>[] = useMemo(
    () => [
      {
        field: 'rowIndex',
        headerName: t('contests.rating.columns.place'),
        width: 90,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: ({ value, row }) => (
          <Typography variant="subtitle1" fontWeight={800}>
            {value ?? row.rowIndex ?? '--'}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('contests.rating.columns.user'),
        flex: 1.3,
        minWidth: 220,
        sortable: false,
        renderCell: ({ row }) => <ContestantView contestant={row} imgSize={28} />,
      },
      {
        field: 'rating',
        headerName: t('contests.rating.columns.rating'),
        flex: 1,
        minWidth: 200,
        sortable: true,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <ContestsRatingChip title={row.ratingTitle} imgSize={28} />
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle2" fontWeight={800}>
                {row.rating ?? '--'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'capitalize' }}
              >
                {row.ratingTitle}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'max_rating',
        headerName: t('contests.rating.columns.maxRating'),
        flex: 1,
        minWidth: 200,
        sortable: true,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <ContestsRatingChip title={row.maxRatingTitle ?? row.ratingTitle} imgSize={24} />
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle2" fontWeight={800}>
                {row.maxRating ?? '--'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'capitalize' }}
              >
                {row.maxRatingTitle ?? '--'}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'contestants_count',
        headerName: t('contests.rating.columns.contests'),
        flex: 0.7,
        minWidth: 160,
        sortable: true,
        headerAlign: 'right',
        align: 'right',
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
          >
            <IconifyIcon icon="mdi:podium" sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="subtitle2" fontWeight={700}>
              {row.contestantsCount}
            </Typography>
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
      loading={loading}
      rows={rows}
      columns={columns}
      localeText={{ noRowsLabel: t('common.dataGrid.noRows.contestsRating') }}
      getRowId={(row) => row.username}
      getRowClassName={({ row }) =>
        rowMatchesUsername(row, currentUsername) ? 'MuiDataGrid-row--currentUser' : ''
      }
      rowCount={rowCount}
      paginationMode="server"
      sortingMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      pageSizeOptions={[10, 20, 50]}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      getRowHeight={() => 76}
      sx={{
        border: 'none',
        '& .MuiDataGrid-columnHeaders': { backgroundColor: 'background.default' },
        '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
        '& .MuiDataGrid-cell': { py: 2 },
        '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' },
      }}
    />
  );
};

export default ContestsRatingPageTable;
