import { useArenasList } from 'modules/arena/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

export const useArenaListPage = () => {
  const { state, setField } = useRouteQueryState({
    defaults: { page: 1 },
    schema: { page: { ...numberParam({ min: 1 }), param: 'page' } },
    historyByKey: { page: 'push' },
  });

  const { data, isLoading, error, mutate } = useArenasList({ page: state.page, pageSize: 7 });

  const arenas = data?.data ?? [];
  return { state, setField, data, isLoading, error, mutate, arenas };
};
