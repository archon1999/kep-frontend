import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LinearProgress, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContestsRating } from '../../application/queries';
import { ContestRatingRow } from '../../domain/entities/contest-rating.entity';
import ContestantView from '../components/ContestantView';

type RatingRow = GridValidRowModel & ContestRatingRow;

const orderingFieldMap: Record<string, string> = {
  rating: 'rating',
  max_rating: 'max_rating',
  contestants_count: 'contestants_count',
};

const ContestsRatingPage = () => {
  const { t } = useTranslation();
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({ initialPageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rating', sort: 'desc' }]);

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];

    if (!currentSort) return '-rating';

    const orderingField = orderingFieldMap[currentSort.field] ?? 'rating';
    const prefix = currentSort.sort === 'asc' ? '' : '-';

    return `${prefix}${orderingField}`;
  }, [sortModel]);

  const { data: ratingPage, isLoading } = useContestsRating({
    page,
    pageSize,
    ordering,
  });

  const rows = ratingPage?.data ?? [];
  const rowCount = ratingPage?.total ?? 0;

  const columns: GridColDef<RatingRow>[] = useMemo(
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
            {value ?? row.rowIndex ?? '¢?"'}
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
                {row.rating ?? '¢?"'}
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
                {row.maxRating ?? '¢?"'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'capitalize' }}
              >
                {row.maxRatingTitle ?? '¢?"'}
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

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model.length ? [model[0]] : [{ field: 'rating', sort: 'desc' }]);
  };

  return (
    <Stack direction="column" spacing={3}>
      <PageHeader
        title={t('contests.rating.title')}
        breadcrumb={[
          { label: t('contests.title'), url: resources.Contests },
          { label: t('contests.rating.ordering.rating'), active: true },
        ]}
      />

      <Stack spacing={2} sx={responsivePagePaddingSx}>
        {isLoading ? <LinearProgress /> : null}
        <DataGrid
          autoHeight
          disableRowSelectionOnClick
          loading={isLoading}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.username}
          rowCount={rowCount}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          pageSizeOptions={[12]}
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
      </Stack>
    </Stack>
  );
};

export default ContestsRatingPage;
