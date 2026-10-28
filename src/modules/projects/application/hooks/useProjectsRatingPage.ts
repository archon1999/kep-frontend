import { useAuth } from 'app/providers/AuthProvider';
import useDebouncedInput from 'shared/hooks/useDebouncedInput';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import { stringParam } from 'shared/lib/queryParams';
import { useProjectsRating } from '../queries';

export const useProjectsRatingPage = () => {
  const { currentUser } = useAuth();
  const route = usePaginatedRouteState({
    defaults: { search: '' },
    schema: { search: stringParam() },
    initialPageSize: 10,
  });
  const search = useDebouncedInput(route.state.search, (value) =>
    route.patchFilters({ search: value }),
  );
  const query = useProjectsRating({ ...route.pageParams, search: route.state.search });

  return {
    search,
    query,
    currentUser,
    paginationModel: route.paginationModel,
    onPaginationModelChange: route.onPaginationModelChange,
  };
};
