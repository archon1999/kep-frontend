import { useAuth } from 'app/providers/AuthProvider';
import { useDuelsRating } from 'modules/duels/application/queries.ts';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import { stringParam } from 'shared/lib/queryParams';

export const useDuelsRatingPage = () => {
  const { currentUser } = useAuth();

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });

  const { state } = useRouteQueryState({
    defaults: {
      ordering: '-wins',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });

  const ordering = state.ordering || '-wins';

  const {
    data: ratingPage,
    isLoading,
    error,
    mutate: retry,
  } = useDuelsRating({
    page,
    pageSize,
    ordering,
    pinCurrentUser: Boolean(currentUser?.username),
  });

  const rowCount = useStableGridRowCount(ratingPage?.total, isLoading);
  return {
    currentUser,
    paginationModel,
    onPaginationModelChange,
    ratingPage,
    isLoading,
    rowCount,
    error,
    retry,
  };
};
