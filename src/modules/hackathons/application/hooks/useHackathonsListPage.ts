import { useHackathonsList } from 'modules/hackathons/application';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

export const useHackathonsListPage = () => {
  const { state, setField } = useRouteQueryState({
    defaults: { page: 1 },
    schema: { page: { ...numberParam({ min: 1 }), param: 'page' } },
    historyByKey: { page: 'push' },
  });

  const {
    data: pageResult,
    isLoading,
    error,
    mutate,
  } = useHackathonsList({ page: state.page, pageSize: 6 });

  const hackathons = pageResult?.data ?? [];
  return { state, setField, pageResult, isLoading, error, mutate, hackathons };
};
