import { GridPaginationModel } from '@mui/x-data-grid';

export const gridPaginationToPageParams = (paginationModel: GridPaginationModel) => {
  const pageSize = paginationModel.pageSize;
  const offset = paginationModel.page * pageSize;

  return {
    page: paginationModel.page + 1,
    pageSize,
    offset,
  };
};

export const paginateRows = <T>(rows: readonly T[], paginationModel: GridPaginationModel) => {
  const { offset, pageSize } = gridPaginationToPageParams(paginationModel);
  return rows.slice(offset, offset + pageSize);
};
