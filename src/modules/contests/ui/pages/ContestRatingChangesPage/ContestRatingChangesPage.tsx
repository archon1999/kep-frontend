import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getRankColor } from 'app/theme/colors/medals';
import { useContestRatingChangesPage } from 'modules/contests/application/hooks/useContestRatingChangesPage';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DataGridListPagination from 'shared/components/pagination/DataGridListPagination';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';

const ContestRatingChangesPage = () => {
  const {
    contest,
    isContestLoading,
    contestError,
    contestants,
    isLoading,
    sectionError,
    paginationModel,
    onPaginationModelChange,
    contestId,
    sortModel,
    setSortModel,
  } = useContestRatingChangesPage();

  const { t } = useTranslation();

  const columns: GridColDef<ContestantEntity>[] = useMemo(
    () => [
      {
        field: 'rank',
        headerName: '#',
        minWidth: 70,
        flex: 0.3,
        sortable: true,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700} color={getRankColor(row.rank)}>
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
    <ContestPageLayout
      flush
      error={contestError || sectionError}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.ratingChanges.title')}
          contest={contest}
          contestId={contestId}
          isLoading={isContestLoading}
        />
      }
    >
      <DataGrid
        className="kep-data-grid-section"
        slots={{ pagination: DataGridListPagination }}
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
    </ContestPageLayout>
  );
};

export default ContestRatingChangesPage;
