import { useMemo } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useChallengesRating } from 'modules/challenges/application/queries.ts';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';
import { stringParam } from 'shared/lib/queryParams';

export const useChallengesRatingPage = () => {
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

  const handleSortModelChange = (model: GridSortModel) => {
    const current = model[0];
    patchFilters({
      ordering: current ? (current.sort === 'asc' ? '' : '-') + current.field : '-rating',
    });
  };
  const { page, pageSize } = pageParams;

  const sortModel = useMemo<GridSortModel>(() => {
    const ordering = state.ordering || '-rating';
    const isDescending = ordering.startsWith('-');
    const field = isDescending ? ordering.slice(1) : ordering;

    return [{ field, sort: isDescending ? 'desc' : 'asc' }];
  }, [state.ordering]);

  const ordering = state.ordering || '-rating';

  const {
    data: ratingPage,
    isLoading,
    error,
    mutate,
  } = useChallengesRating({
    page,
    pageSize,
    ordering,
    pinCurrentUser: Boolean(currentUser?.username),
  });
  return {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    handleSortModelChange,
    ratingPage,
    isLoading,
    error,
    retry: () => void mutate(),
    sortModel,
  };
};
