import { useTranslation } from 'react-i18next';
import { Avatar, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { rowMatchesUsername } from 'shared/lib/pinnedRows';

export type ChallengesRatingPageRow = GridValidRowModel & {
  username: string;
  avatar?: string;
  rowIndex: number;
  rating: number;
  rankTitle?: string;
  wins?: number;
  draws?: number;
  losses?: number;
  record?: string;
  all?: number;
};

type ChallengesRatingPageTableProps = {
  rows: ChallengesRatingPageRow[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  loading: boolean;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
  currentUsername?: string;
};

const ChallengesRatingPageTable = ({
  rows,
  rowCount,
  paginationModel,
  sortModel,
  loading,
  onPaginationModelChange,
  onSortModelChange,
  currentUsername,
}: ChallengesRatingPageTableProps) => {
  const { t } = useTranslation();

  const columns: GridColDef<ChallengesRatingPageRow>[] = [
    {
      field: 'rowIndex',
      headerName: t('challenges.table.place'),
      width: 90,
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="subtitle2" fontWeight={800} color="primary">
          #{row.rowIndex}
        </Typography>
      ),
    },
    {
      field: 'username',
      headerName: t('challenges.table.username'),
      flex: 1.4,
      minWidth: 180,
      sortable: true,
      renderCell: ({ row }) => (
        <UserPopover username={row.username} avatar={row.avatar}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar src={row.avatar} alt={row.username} sx={{ width: 42, height: 42 }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.primary" noWrap>
              {row.username}
            </Typography>
          </Stack>
        </UserPopover>
      ),
    },
    {
      field: 'rankTitle',
      headerName: t('challenges.table.rank'),
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: ({ value }) => <ChallengesRatingChip title={value as string} size="small" />,
    },
    {
      field: 'rating',
      headerName: t('challenges.table.rating'),
      flex: 0.6,
      minWidth: 120,
      sortable: true,
      renderCell: ({ value, row }) => (
        <Stack direction="row" spacing={0.25}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            {value ?? '--'}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'capitalize' }}
          >
            {row.rankTitle}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'record',
      headerName: t('challenges.table.record'),
      flex: 1.1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" rowGap={1}>
          <Typography color="success">{row.wins}W</Typography>
          <Typography>{row.draws}D</Typography>
          <Typography color="error">{row.losses}L</Typography>
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rowHeight={80}
      disableRowSelectionOnClick
      columns={columns}
      rows={rows}
      getRowClassName={({ row }) =>
        rowMatchesUsername(row, currentUsername) ? 'MuiDataGrid-row--currentUser' : ''
      }
      localeText={{ noRowsLabel: t('common.dataGrid.noRows.challengesRating') }}
      rowCount={rowCount}
      paginationMode="server"
      sortingMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      loading={loading}
      pageSizeOptions={[10, 20, 50]}
      disableColumnFilter
      disableColumnSelector
      disableColumnMenu
    />
  );
};

export default ChallengesRatingPageTable;
