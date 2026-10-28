import { useMemo } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useContestsRating } from 'modules/contests/application/queries';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import { stringParam } from 'shared/lib/queryParams';

const orderingFieldMap: Record<string, string> = {
  rating: 'rating',
  max_rating: 'max_rating',
  contestants_count: 'contestants_count',
};

const sortFieldByOrdering = Object.fromEntries(
  Object.entries(orderingFieldMap).map(([field, ordering]) => [ordering, field]),
) as Record<string, string>;

export const useContestsRatingPage = () => {
  const { currentUser } = useAuth();

  const { state, patchFilters, paginationModel, onPaginationModelChange, pageParams } =
    usePaginatedRouteState({
      initialPageSize: 10,
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

  const setOrdering = (ordering: typeof state.ordering) => patchFilters({ ordering });
  const { page, pageSize } = pageParams;

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
      setOrdering('-rating');
      return;
    }

    const orderingField = orderingFieldMap[currentSort.field] ?? 'rating';
    const prefix = currentSort.sort === 'asc' ? '' : '-';
    setOrdering(`${prefix}${orderingField}`);
  };
  return {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    ratingPage,
    isLoading,
    sortModel,
    rows,
    handleSortModelChange,
  };
};
