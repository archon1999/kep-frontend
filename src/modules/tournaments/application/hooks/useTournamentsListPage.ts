import { useTournamentsList } from 'modules/tournaments/application';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

export const useTournamentsListPage = () => {
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
  } = useTournamentsList({ page: state.page, pageSize: 6 });

  const tournaments = pageResult?.data ?? [];
  return { state, setField, pageResult, isLoading, error, mutate, tournaments };
};
