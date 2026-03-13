import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useDuelsRating } from '../../application/queries.ts';

const DuelsRatingPage = () => {
  const { t } = useTranslation();

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({ initialPageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'wins', sort: 'desc' }]);

  const ordering = useMemo(() => {
    if (!sortModel.length) return '-wins';
    const [{ field, sort }] = sortModel;
    const prefix = sort === 'asc' ? '' : '-';
    return `${prefix}${field}`;
  }, [sortModel]);

  const { data: ratingPage, isLoading } = useDuelsRating({ page, pageSize, ordering });

  type RatingRow = GridValidRowModel & {
    username: string;
    avatar?: string;
    duels?: number;
    wins?: number;
    draws?: number;
    losses?: number;
    record?: string;
    rowIndex?: number;
  };

  const rows: RatingRow[] =
    ratingPage?.data?.map((row, index) => ({
      id: `${row.user.username}-${index}`,
      username: row.user.username,
      avatar: row.user.avatar,
      duels: row.duels ?? 0,
      wins: row.wins ?? 0,
      draws: row.draws ?? 0,
      losses: row.losses ?? 0,
      rowIndex: row.rowIndex ?? (page - 1) * pageSize + index + 1,
    })) ?? [];

  const columns: GridColDef<RatingRow>[] = [
    {
      field: 'rowIndex',
      headerName: t('duels.table.place'),
      width: 90,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="subtitle1" fontWeight={800}>
          #{value}
        </Typography>
      ),
    },
    {
      field: 'username',
      headerName: t('duels.table.username'),
      flex: 1.2,
      minWidth: 180,
      sortable: true,
      renderCell: ({ row }) => (
        <UserPopover username={row.username}>
          <Stack spacing={0.25}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {row.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('duels.record', {
                wins: row?.wins ?? 0,
                draws: row?.draws ?? 0,
                losses: row?.losses ?? 0,
              })}
            </Typography>
          </Stack>
        </UserPopover>
      ),
    },
    {
      field: 'duels',
      headerName: t('duels.table.duels'),
      flex: 0.7,
      minWidth: 120,
      sortable: true,
      renderCell: ({ value }) => (
        <Typography variant="subtitle1" fontWeight={800} color="text.primary">
          {value ?? 0}
        </Typography>
      ),
    },
    {
      field: 'wins',
      headerName: t('duels.table.wins'),
      flex: 0.6,
      minWidth: 90,
      sortable: true,
    },
    {
      field: 'draws',
      headerName: t('duels.table.draws'),
      flex: 0.6,
      minWidth: 90,
      sortable: true,
    },
    {
      field: 'losses',
      headerName: t('duels.table.losses'),
      flex: 0.6,
      minWidth: 90,
      sortable: true,
    },
  ];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            {t('duels.ratingTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.ratingSubtitle')}
          </Typography>
        </Stack>

        <DataGrid
          autoHeight
          disableRowSelectionOnClick
          loading={isLoading}
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          rowCount={ratingPage?.total ?? rows.length}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableColumnMenu
          pageSizeOptions={[10, 12, 20]}
          getRowHeight={() => 72}
          paginationMode="server"
        />
      </Stack>
    </Box>
  );
};

export default DuelsRatingPage;
