import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useChallengesRating } from '../../application/queries.ts';

const ChallengesRatingPage = () => {
  const { t } = useTranslation();
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({ initialPageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rating', sort: 'desc' }]);

  const ordering = useMemo(() => {
    if (!sortModel.length) return '-rating';
    const [{ field, sort }] = sortModel;
    const prefix = sort === 'asc' ? '' : '-';
    return `${prefix}${field}`;
  }, [sortModel]);

  const { data: ratingPage, isLoading } = useChallengesRating({ page, pageSize, ordering });

  type RatingRow = GridValidRowModel & {
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

  const columns: GridColDef<RatingRow>[] = [
    {
      field: 'rowIndex',
      headerName: t('challenges.table.place'),
      width: 90,
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="subtitle2" fontWeight={800} color="primary">
          #{(row as RatingRow).rowIndex}
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
            {value ?? '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
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
          <Typography color="success">{row?.wins}W</Typography>
          <Typography>{row?.draws}D</Typography>
          <Typography color="error">{row?.losses}L</Typography>
        </Stack>
      ),
    },
  ];

  const rows: RatingRow[] = (ratingPage?.data ?? []).map((row, index) => ({
    id: row.username,
    ...row,
    rowIndex: (page - 1) * pageSize + index + 1,
    record: t('challenges.record', {
      wins: row?.wins ?? 0,
      draws: row?.draws ?? 0,
      losses: row?.losses ?? 0,
    }),
  }));

  return (
    <Stack direction="column">
      <PageHeader
        title={t('challenges.ratingTitle')}
        breadcrumb={[
          { label: t('challenges.title'), url: resources.Challenges },
          { label: t('problems.rating.ordering.rating'), active: true },
        ]}
      />

      <Box sx={responsivePagePaddingSx}>
        <DataGrid
          autoHeight
          rowHeight={80}
          disableRowSelectionOnClick
          columns={columns}
          rows={rows}
          rowCount={ratingPage?.total ?? 0}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={(model) =>
            setSortModel(model.length ? model : [{ field: 'rating', sort: 'desc' }])
          }
          loading={isLoading}
          pageSizeOptions={[10, 20, 50]}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
        />
      </Box>
    </Stack>
  );
};

export default ChallengesRatingPage;
