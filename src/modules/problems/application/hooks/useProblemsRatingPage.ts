import { useMemo } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useProblemsRating } from 'modules/problems/application/queries';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import { stringParam } from 'shared/lib/queryParams';

const sortFieldMap: Record<string, string> = {
  rating: 'rating',
  solved: 'solved',
  beginner: 'beginner',
  basic: 'basic',
  normal: 'normal',
  medium: 'medium',
  advanced: 'advanced',
  hard: 'hard',
  extremal: 'extremal',
};

const orderingFieldMap = Object.fromEntries(
  Object.entries(sortFieldMap).map(([field, ordering]) => [ordering, field]),
) as Record<string, string>;

export const useProblemsRatingPage = () => {
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
    const normalizedOrdering = state.ordering || '-rating';
    const isDescending = normalizedOrdering.startsWith('-');
    const orderingField = isDescending ? normalizedOrdering.slice(1) : normalizedOrdering;
    const field = orderingFieldMap[orderingField] ?? 'rating';

    return [{ field, sort: isDescending ? 'desc' : 'asc' }];
  }, [state.ordering]);

  const ordering = state.ordering || '-rating';

  const {
    data: ratingPage,
    isLoading,
    isValidating,
  } = useProblemsRating({
    ordering,
    page,
    pageSize,
    pinCurrentUser: Boolean(currentUser?.username),
  });

  const rows = useMemo(
    () =>
      mergePinnedRows(ratingPage?.data ?? [], ratingPage?.pinnedRows, (row) => row.user.username),
    [ratingPage?.data, ratingPage?.pinnedRows],
  );

  const rowCount = ratingPage?.total ?? 0;

  const handleSortModelChange = (model: GridSortModel) => {
    const currentSort = model[0];

    if (!currentSort) {
      setOrdering('-rating');
      return;
    }

    const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
    const orderingPrefix = currentSort.sort === 'desc' ? '-' : '';

    setOrdering(`${orderingPrefix}${orderingField}`);
  };
  return {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    isLoading,
    isValidating,
    sortModel,
    rows,
    rowCount,
    handleSortModelChange,
  };
};
