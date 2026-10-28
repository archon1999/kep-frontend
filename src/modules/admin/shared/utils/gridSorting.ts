import type { SortModel as GridSortModel } from 'shared/lib/grid-state';

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
