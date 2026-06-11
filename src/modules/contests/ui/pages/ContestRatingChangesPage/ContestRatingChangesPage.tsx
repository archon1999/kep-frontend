import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestContestants } from 'modules/contests/application/queries';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import { ContestContestantsParams } from 'modules/contests/domain/ports/contests.repository';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import useGridPagination from 'shared/hooks/useGridPagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const getContestantsOrdering = (sortModel: GridSortModel): ContestContestantsParams['ordering'] => {
  const sort = sortModel[0];
  if (!sort?.sort || (sort.field !== 'rank' && sort.field !== 'delta')) {
    return undefined;
  }

  return sort.sort === 'desc' ? `-${sort.field}` : sort.field;
};

const ContestRatingChangesPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rank', sort: 'asc' }]);
  const ordering = getContestantsOrdering(sortModel);

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const { data: contestants = [], isLoading } = useContestContestants(contestId, { ordering });
  useDocumentTitle(contest?.title, { contestTitle: contest?.title });

  const { paginationModel, onPaginationModelChange } = useGridPagination({
    initialPageSize: 20,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });

  const columns: GridColDef<ContestantEntity>[] = useMemo(
    () => [
      {
        field: 'rank',
        headerName: '#',
        minWidth: 70,
        flex: 0.3,
        sortable: true,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700}>
            {row.rank ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('contests.ratingChanges.columns.contestant'),
        minWidth: 200,
        flex: 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <ContestantView
            contestant={row}
            imgSize={26}
            isVirtual={row.isVirtual}
            isUnrated={row.isUnrated}
            isOfficial={row.isOfficial}
          />
        ),
      },
      {
        field: 'points',
        headerName: t('contests.standings.points'),
        minWidth: 120,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => (
          <Typography color="primary" variant="body2" fontWeight={700}>
            {row.points ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'delta',
        headerName: t('contests.ratingChanges.columns.delta'),
        minWidth: 120,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: true,
        renderHeader: () => (
          <Tooltip title={t('contests.ratingChanges.columns.delta')} arrow>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
              }}
            >
              <IconifyIcon icon="mdi:delta" fontSize={20} />
            </Box>
          </Tooltip>
        ),
        renderCell: ({ row }) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color={
              row.delta !== undefined && row.delta !== null && row.delta > 0
                ? 'success.main'
                : row.delta !== undefined && row.delta !== null && row.delta < 0
                  ? 'error.main'
                  : 'text.primary'
            }
          >
            {row.delta !== undefined && row.delta !== null
              ? `${row.delta > 0 ? '+' : ''}${row.delta}`
              : '—'}
          </Typography>
        ),
      },
      {
        field: 'rating',
        headerName: t('contests.ratingChanges.columns.rating'),
        minWidth: 200,
        flex: 0.9,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            {row.rating ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ContestsRatingChip title={row.ratingTitle} imgSize={22} />
                <Typography variant="body2" fontWeight={700}>
                  {row.rating}
                </Typography>
              </Stack>
            ) : null}
            <Typography variant="body2" color="text.secondary">
              →
            </Typography>
            {row.newRating ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ContestsRatingChip title={row.newRatingTitle} imgSize={22} />
                <Typography variant="body2" fontWeight={700}>
                  {row.newRating}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Stack>
        ),
      },
    ],
    [t],
  );

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.ratingChanges.title')}
        contest={contest as any}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <DataGrid
        autoHeight
        disableColumnMenu
        disableColumnFilter
        disableRowSelectionOnClick
        rows={contestants}
        columns={columns}
        localeText={{ noRowsLabel: t('common.dataGrid.noRows.contestRatingChanges') }}
        loading={isLoading}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        sortingOrder={['asc', 'desc']}
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[20, 50, 100]}
        getRowId={(row) => row.username}
      />
    </Stack>
  );
};

export default ContestRatingChangesPage;
