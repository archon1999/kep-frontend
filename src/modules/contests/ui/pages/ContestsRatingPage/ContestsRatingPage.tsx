import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LinearProgress, Stack } from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContestsRating } from 'modules/contests/application/queries';
import ContestsRatingPageTable from './ContestsRatingPageTable.tsx';

const orderingFieldMap: Record<string, string> = {
  rating: 'rating',
  max_rating: 'max_rating',
  contestants_count: 'contestants_count',
};

const sortFieldByOrdering = Object.fromEntries(
  Object.entries(orderingFieldMap).map(([field, ordering]) => [ordering, field]),
) as Record<string, string>;

const ContestsRatingPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({
    initialPageSize: 10,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  const { state, setField } = useRouteQueryState({
    defaults: {
      ordering: '-rating',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });

  const sortModel = useMemo<GridSortModel>(() => {
    const ordering = state.ordering || '-rating';
    const isDescending = ordering.startsWith('-');
    const orderingField = isDescending ? ordering.slice(1) : ordering;
    const field = sortFieldByOrdering[orderingField] ?? 'rating';

    return [{ field, sort: isDescending ? 'desc' : 'asc' }];
  }, [state.ordering]);

  const ordering = state.ordering || '-rating';
  const { data: ratingPage, isLoading } = useContestsRating({
    page,
    pageSize,
    ordering,
    pinCurrentUser: Boolean(currentUser?.username),
  });
  const rows = useMemo(
    () => mergePinnedRows(ratingPage?.data ?? [], ratingPage?.pinnedRows, (row) => row.username),
    [ratingPage?.data, ratingPage?.pinnedRows],
  );

  const handleSortModelChange = (model: GridSortModel) => {
    const currentSort = model[0];

    if (!currentSort) {
      setField('ordering', '-rating');
      return;
    }

    const orderingField = orderingFieldMap[currentSort.field] ?? 'rating';
    const prefix = currentSort.sort === 'asc' ? '' : '-';
    setField('ordering', `${prefix}${orderingField}`);
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

        <ContestsRatingPageTable
          rows={rows}
          rowCount={ratingPage?.total ?? 0}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          currentUsername={currentUser?.username}
        />
      </Stack>
    </Stack>
  );
};

export default ContestsRatingPage;
