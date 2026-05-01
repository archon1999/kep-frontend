import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { gridPaginationToPageParams } from 'shared/lib/pagination';
import { numberParam, QueryHistoryMode } from 'shared/lib/queryParams';

type UseGridPaginationOptions = {
  initialPage?: number;
  initialPageSize?: number;
  querySync?: {
    pageKey?: string;
    pageSizeKey?: string;
    historyByKey?: {
      page?: QueryHistoryMode;
      pageSize?: QueryHistoryMode;
    };
  };
};

const useGridPagination = ({
  initialPage = 0,
  initialPageSize = 10,
  querySync,
}: UseGridPaginationOptions = {}) => {
  const querySyncEnabled = Boolean(querySync);
  const pageKey = querySync?.pageKey ?? 'page';
  const pageSizeKey = querySync?.pageSizeKey ?? 'pageSize';
  const pageHistory = querySync?.historyByKey?.page ?? 'push';
  const pageSizeHistory = querySync?.historyByKey?.pageSize ?? 'push';
  const [localPaginationModel, setLocalPaginationModel] = useState<GridPaginationModel>({
    page: initialPage,
    pageSize: initialPageSize,
  });
  const queryDefaults = useMemo(
    () => ({
      page: initialPage + 1,
      pageSize: initialPageSize,
    }),
    [initialPage, initialPageSize],
  );
  const querySchema = useMemo(
    () => ({
      page: {
        ...numberParam({ min: 1 }),
        param: pageKey,
      },
      pageSize: {
        ...numberParam({ min: 1 }),
        param: pageSizeKey,
      },
    }),
    [pageKey, pageSizeKey],
  );
  const queryHistoryByKey = useMemo(
    () => ({
      page: pageHistory,
      pageSize: pageSizeHistory,
    }),
    [pageHistory, pageSizeHistory],
  );
  const { state: urlPaginationState, patchState: patchUrlPaginationState } = useRouteQueryState({
    enabled: querySyncEnabled,
    defaults: queryDefaults,
    schema: querySchema,
    historyByKey: queryHistoryByKey,
  });

  const paginationModel = useMemo(
    () =>
      querySyncEnabled
        ? {
            page: Math.max((urlPaginationState.page ?? 1) - 1, 0),
            pageSize: urlPaginationState.pageSize ?? initialPageSize,
          }
        : localPaginationModel,
    [
      initialPageSize,
      localPaginationModel,
      querySyncEnabled,
      urlPaginationState.page,
      urlPaginationState.pageSize,
    ],
  );
  const paginationModelRef = useRef(paginationModel);
  const patchUrlPaginationStateRef = useRef(patchUrlPaginationState);

  useEffect(() => {
    paginationModelRef.current = paginationModel;
  }, [paginationModel]);

  useEffect(() => {
    patchUrlPaginationStateRef.current = patchUrlPaginationState;
  }, [patchUrlPaginationState]);

  const pageParams = useMemo(
    () => gridPaginationToPageParams(paginationModel),
    [paginationModel],
  );

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      if (querySyncEnabled) {
        patchUrlPaginationStateRef.current(
          {
            page: model.page + 1,
            pageSize: model.pageSize,
          },
          { resetPages: false },
        );
        return;
      }

      setLocalPaginationModel(model);
    },
    [querySyncEnabled],
  );

  const setPaginationModel = useCallback(
    (
      nextModel:
        | GridPaginationModel
        | ((prevModel: GridPaginationModel) => GridPaginationModel),
    ) => {
      if (querySyncEnabled) {
        const resolvedModel =
          typeof nextModel === 'function' ? nextModel(paginationModelRef.current) : nextModel;

        patchUrlPaginationStateRef.current(
          {
            page: resolvedModel.page + 1,
            pageSize: resolvedModel.pageSize,
          },
          { resetPages: false },
        );
        return;
      }

      setLocalPaginationModel(nextModel);
    },
    [querySyncEnabled],
  );

  return {
    paginationModel,
    pageParams,
    setPaginationModel,
    onPaginationModelChange: handlePaginationModelChange,
  };
};

export default useGridPagination;
