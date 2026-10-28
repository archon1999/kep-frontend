import { useTranslation } from 'react-i18next';
import { Avatar, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import ChallengeRecord from 'modules/challenges/ui/shared/components/ChallengeRecord';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
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
  const { t, i18n } = useTranslation();
  const { down } = useBreakpoints();
  const compact = down('md');
  const stableRowCount = useStableGridRowCount(rowCount, loading);

  const columns: GridColDef<ChallengesRatingPageRow>[] = [
    {
      field: 'rowIndex',
      headerName: t('challenges.table.place'),
      width: compact ? 52 : 80,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          variant="metric"
          sx={{ fontSize: 20 }}
          color={row.rowIndex <= 3 ? 'warning.main' : 'text.secondary'}
        >
          {String(row.rowIndex).padStart(2, '0')}
        </Typography>
      ),
    },
    {
      field: 'username',
      headerName: t('challenges.table.username'),
      flex: 1.4,
      minWidth: compact ? 150 : 210,
      sortable: true,
      renderCell: ({ row }) => (
        <UserPopover username={row.username} avatar={row.avatar}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar
              src={row.avatar}
              alt=""
              sx={{ width: 32, height: 32, display: { xs: 'none', sm: 'flex' } }}
            />
            <Stack gap={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary" noWrap>
                {row.username}
              </Typography>
              {compact && (
                <ChallengeRecord wins={row.wins} draws={row.draws} losses={row.losses} compact />
              )}
            </Stack>
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
      flex: compact ? undefined : 0.6,
      width: compact ? 100 : undefined,
      minWidth: 90,
      sortable: true,
      renderCell: ({ value, row }) => (
        <Stack direction="column" alignItems="flex-start" gap={0.5}>
          <Typography variant="metric" sx={{ fontSize: 21 }}>
            {Number(value ?? 0).toLocaleString(i18n.language, { maximumFractionDigits: 1 })}
          </Typography>
          {compact && <ChallengesRatingChip title={row.rankTitle} size="small" />}
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
        <ChallengeRecord wins={row.wins} draws={row.draws} losses={row.losses} compact />
      ),
    },
  ];

  return (
    <DataGrid
      className="kep-data-grid-section"
      autoHeight
      rowHeight={compact ? 88 : 76}
      disableRowSelectionOnClick
      columns={columns}
      columnVisibilityModel={{ rankTitle: !compact, record: !compact }}
      rows={rows}
      getRowClassName={({ row }) =>
        rowMatchesUsername(row, currentUsername) ? 'MuiDataGrid-row--currentUser' : ''
      }
      localeText={{ noRowsLabel: t('common.dataGrid.noRows.challengesRating') }}
      rowCount={stableRowCount}
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
