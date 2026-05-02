import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestRegistrants } from 'modules/contests/application/queries';
import { ContestRegistrant } from 'modules/contests/domain/entities/contest-registrant.entity';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import { ApiContestsRegistrantsListOrdering } from 'shared/api/orval/generated/endpoints/index.schemas';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ContestRegistrantsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  useDocumentTitle(contest?.title, { contestTitle: contest?.title });

  const { paginationModel, onPaginationModelChange, pageParams } = useGridPagination({
    initialPageSize: 20,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  const { state, setField } = useRouteQueryState({
    defaults: {
      ordering: ApiContestsRegistrantsListOrdering['-contests_rating'],
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });
  const ordering = state.ordering as ApiContestsRegistrantsListOrdering;
  const sortModel = useMemo<GridSortModel>(() => {
    if (
      ordering === ApiContestsRegistrantsListOrdering.id ||
      ordering === ApiContestsRegistrantsListOrdering['-id']
    ) {
      return [
        {
          field: 'rowIndex',
          sort: ordering === ApiContestsRegistrantsListOrdering.id ? 'asc' : 'desc',
        },
      ];
    }

    if (
      ordering === ApiContestsRegistrantsListOrdering.contests_rating ||
      ordering === ApiContestsRegistrantsListOrdering['-contests_rating']
    ) {
      return [
        {
          field: 'rating',
          sort: ordering === ApiContestsRegistrantsListOrdering.contests_rating ? 'asc' : 'desc',
        },
      ];
    }

    return [
      {
        field: 'username',
        sort: ordering === ApiContestsRegistrantsListOrdering.username ? 'asc' : 'desc',
      },
    ];
  }, [ordering]);

  const { data: registrantsPage, isLoading } = useContestRegistrants(contestId, {
    page: pageParams.page,
    pageSize: pageParams.pageSize,
    ordering,
  });

  const total = registrantsPage?.total ?? 0;
  const registrants = registrantsPage?.data ?? [];

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

  const handleSortChange = (model: GridSortModel) => {
    if (!model.length) {
      setField('ordering', ApiContestsRegistrantsListOrdering['-contests_rating']);
      return;
    }

    const { field, sort } = model[0];
    if (field === 'rowIndex') {
      setField(
        'ordering',
        sort === 'asc'
          ? ApiContestsRegistrantsListOrdering.id
          : ApiContestsRegistrantsListOrdering['-id'],
      );
      return;
    }
    if (field === 'rating') {
      setField(
        'ordering',
        sort === 'asc'
          ? ApiContestsRegistrantsListOrdering.contests_rating
          : ApiContestsRegistrantsListOrdering['-contests_rating'],
      );
      return;
    }
    if (field === 'username') {
      setField(
        'ordering',
        sort === 'asc'
          ? ApiContestsRegistrantsListOrdering.username
          : ApiContestsRegistrantsListOrdering['-username'],
      );
      return;
    }
    setField('ordering', ApiContestsRegistrantsListOrdering['-contests_rating']);
  };

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.registrants.title')}
        contest={contest}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <DataGrid
            autoHeight
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            rows={registrants}
            columns={columns}
            loading={isLoading}
            rowCount={total}
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
        <Grid size={{ xs: 12, md: 4 }}>
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestRegistrantsPage;
