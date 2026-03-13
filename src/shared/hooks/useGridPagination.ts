import { useCallback, useMemo, useState } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid';
import { gridPaginationToPageParams } from 'shared/lib/pagination';

type UseGridPaginationOptions = {
  initialPage?: number;
  initialPageSize?: number;
};

const useGridPagination = ({
  initialPage = 0,
  initialPageSize = 10,
}: UseGridPaginationOptions = {}) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const pageParams = useMemo(
    () => gridPaginationToPageParams(paginationModel),
    [paginationModel],
  );

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => setPaginationModel(model),
    [],
  );

  return {
    paginationModel,
    pageParams,
    setPaginationModel,
    onPaginationModelChange: handlePaginationModelChange,
  };
};

export default useGridPagination;
