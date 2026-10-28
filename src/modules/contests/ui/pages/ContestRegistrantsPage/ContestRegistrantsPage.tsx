import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useContestRegistrantsPage } from 'modules/contests/application/hooks/useContestRegistrantsPage';
import { ContestRegistrant } from 'modules/contests/domain/entities/contest-registrant.entity';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import DataGridListPagination from 'shared/components/pagination/DataGridListPagination';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';

const ContestRegistrantsPage = () => {
  const {
    contest,
    isContestLoading,
    contestError,
    paginationModel,
    onPaginationModelChange,
    isLoading,
    sectionError,
    stableRowCount,
    contestId,
    sortModel,
    registrants,
    handleSortChange,
  } = useContestRegistrantsPage();

  const { t } = useTranslation();

  const columns: GridColDef<ContestRegistrant>[] = useMemo(
    () => [
      {
        field: 'rowIndex',
        headerName: '#',
        minWidth: 70,
        flex: 0.3,
        sortable: true,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700}>
            {row.rowIndex ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('contests.registrants.columns.user'),
        minWidth: 200,
        flex: 1.2,
        sortable: true,
        renderCell: ({ row }) => (
          <UserPopover username={row.username}>
            <Typography sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}>
              {row.username}
            </Typography>
            {row.team?.name ? (
              <Typography variant="caption" color="text.secondary">
                · {row.team.name}
              </Typography>
            ) : null}
          </UserPopover>
        ),
      },
      {
        field: 'rating',
        headerName: t('contests.registrants.columns.rating'),
        minWidth: 140,
        flex: 0.8,
        sortable: true,
        renderCell: ({ row }) =>
          row.rating ? (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <ContestsRatingChip title={row.ratingTitle} imgSize={22} />
              <Typography variant="body2" fontWeight={700}>
                {row.rating}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
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
          title={contest?.title ?? t('contests.registrants.title')}
          contest={contest}
          contestId={contestId}
          isLoading={isContestLoading}
        />
      }
    >
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <DataGrid
            className="kep-data-grid-section"
            slots={{ pagination: DataGridListPagination }}
            autoHeight
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            rows={registrants}
            columns={columns}
            localeText={{ noRowsLabel: t('common.dataGrid.noRows.contestRegistrants') }}
            loading={isLoading}
            rowCount={stableRowCount}
            paginationMode="server"
            sortingMode="server"
            onSortModelChange={handleSortChange}
            sortModel={sortModel}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={[20, 50, 100]}
            getRowId={(row) => row.username}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            minWidth: 0,
            borderLeft: { md: '1px solid var(--kep-line)' },
            borderTop: { xs: '1px solid var(--kep-line)', md: 0 },
          }}
        >
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />
        </Grid>
      </Grid>
    </ContestPageLayout>
  );
};

export default ContestRegistrantsPage;
