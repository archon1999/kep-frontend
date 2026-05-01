import { useCallback, useMemo, useState } from 'react';
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
  const [localPaginationModel, setLocalPaginationModel] = useState<GridPaginationModel>({
    page: initialPage,
    pageSize: initialPageSize,
  });
  const { state: urlPaginationState, patchState: patchUrlPaginationState } = useRouteQueryState({
    enabled: Boolean(querySync),
    defaults: {
      page: initialPage + 1,
      pageSize: initialPageSize,
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: querySync?.pageKey ?? 'page',
      },
      pageSize: {
        ...numberParam({ min: 1 }),
        param: querySync?.pageSizeKey ?? 'pageSize',
      },
    },
    historyByKey: {
      page: querySync?.historyByKey?.page ?? 'push',
      pageSize: querySync?.historyByKey?.pageSize ?? 'push',
    },
  });

  const paginationModel = useMemo(
    () =>
      querySync
        ? {
            page: Math.max((urlPaginationState.page ?? 1) - 1, 0),
            pageSize: urlPaginationState.pageSize ?? initialPageSize,
          }
        : localPaginationModel,
    [initialPageSize, localPaginationModel, querySync, urlPaginationState.page, urlPaginationState.pageSize],
  );

  const pageParams = useMemo(
    () => gridPaginationToPageParams(paginationModel),
    [paginationModel],
  );

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      if (querySync) {
        patchUrlPaginationState(
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
    [patchUrlPaginationState, querySync],
  );

  const setPaginationModel = useCallback(
    (
      nextModel:
        | GridPaginationModel
        | ((prevModel: GridPaginationModel) => GridPaginationModel),
    ) => {
      if (querySync) {
        const resolvedModel =
          typeof nextModel === 'function' ? nextModel(paginationModel) : nextModel;

        patchUrlPaginationState(
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
    [paginationModel, patchUrlPaginationState, querySync],
  );

  return {
    paginationModel,
    pageParams,
    setPaginationModel,
    onPaginationModelChange: handlePaginationModelChange,
  };
};

export default useGridPagination;
