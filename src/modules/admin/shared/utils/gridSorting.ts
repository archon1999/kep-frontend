import { GridSortModel } from '@mui/x-data-grid';

export const getOrderingFromSortModel = (
  model: GridSortModel,
  fieldMap: Record<string, string> = {},
) => {
  const currentSort = model[0];

  if (!currentSort?.sort) {
    return undefined;
  }

  const orderingField = fieldMap[currentSort.field] ?? currentSort.field;

  return `${currentSort.sort === 'desc' ? '-' : ''}${orderingField}`;
};
