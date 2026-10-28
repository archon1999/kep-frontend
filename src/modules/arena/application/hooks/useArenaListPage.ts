import { useArenasList } from 'modules/arena/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam, stringParam } from 'shared/lib/queryParams';

export const useArenaListPage = () => {
  const { state, setField } = useRouteQueryState({
    defaults: { page: 1, title: '' },
    schema: {
      page: { ...numberParam({ min: 1 }), param: 'page' },
      title: stringParam(),
    },
    historyByKey: { page: 'push' },
    pageResetKeys: ['title'],
  });

  const { data, isLoading, error, mutate } = useArenasList({
    page: state.page,
    pageSize: 7,
    title: state.title.trim() || undefined,
  });

  const arenas = data?.data ?? [];
  return { state, setField, data, isLoading, error, mutate, arenas };
};
