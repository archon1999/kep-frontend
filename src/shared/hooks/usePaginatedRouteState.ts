import { useMemo } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import type { QueryParamConfig } from '../lib/queryParams.ts';
import { numberParam } from '../lib/queryParams.ts';
import useRouteQueryState from './useRouteQueryState.ts';

type PaginationState = { page: number; pageSize: number };

type Options<TFilters extends object> = {
  defaults: TFilters;
  schema: { [Key in keyof TFilters]: QueryParamConfig<NoInfer<TFilters[Key]>> };
  initialPageSize?: number;
};

/** Filters and pagination must share one URL update so resetting a page cannot undo a filter. */
const usePaginatedRouteState = <TFilters extends object>({
  defaults,
  schema,
  initialPageSize = 20,
}: Options<TFilters>) => {
  type RouteState = TFilters & PaginationState;
  const { state, patchState } = useRouteQueryState<RouteState>({
    defaults: { ...defaults, page: 1, pageSize: initialPageSize },
    schema: {
      ...schema,
      page: numberParam({ min: 1 }),
      pageSize: numberParam({ min: 1 }),
    } as { [Key in keyof RouteState]: QueryParamConfig<RouteState[Key]> },
  });

  const paginationModel = useMemo(
    () => ({ page: state.page - 1, pageSize: state.pageSize }),
    [state.page, state.pageSize],
  );
  const pageParams = useMemo(
    () => ({ page: state.page, pageSize: state.pageSize }),
    [state.page, state.pageSize],
  );

  return {
    state,
    paginationModel,
    pageParams,
    patchFilters: (patch: Partial<TFilters>) =>
      patchState((previous) => ({ ...previous, ...patch, page: 1 }), { history: 'replace' }),
    resetFilters: () => patchState({ ...defaults, page: 1 }, { history: 'replace' }),
    onPaginationModelChange: (model: GridPaginationModel) =>
      patchState((previous) => ({ ...previous, page: model.page + 1, pageSize: model.pageSize }), {
        history: 'push',
      }),
    setPage: (page: number) =>
      patchState((previous) => ({ ...previous, page: Math.max(page, 1) }), { history: 'push' }),
  };
};

export default usePaginatedRouteState;
