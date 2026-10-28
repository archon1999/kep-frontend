import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  AdminAutocompleteFieldKind,
  AdminResourceAction,
  AdminResourceOperationsConfig,
  AdminSimpleRow,
  ConfirmAdminAction,
} from 'modules/admin/shared/application/admin-resource-config';
import {
  autocompleteFieldKinds,
  getRowLabelParams,
} from 'modules/admin/shared/application/admin-resource-fields';
import {
  batchAdminResources,
  removeAdminResource,
} from 'modules/admin/shared/application/mutations';
import {
  useAdminResourceList,
  useAdminResourceMeta,
} from 'modules/admin/shared/application/queries';
import { AdminChoiceOption, AdminListParams } from 'modules/admin/shared/domain/types.ts';
import { getOrderingFromSortModel } from 'modules/admin/shared/utils/gridSorting';
import useGridPagination from 'shared/hooks/useGridPagination';
import type {
  RowSelection as GridRowSelectionModel,
  SortModel as GridSortModel,
} from 'shared/lib/grid-state';

export const useAdminResourceListPage = (
  config: AdminResourceOperationsConfig,
  confirm: ConfirmAdminAction,
) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [isBatching, setIsBatching] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>(
    config.defaultSortModel ?? [{ field: 'id', sort: 'desc' }],
  );
  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
      initialPageSize: 20,
      querySync: {
        pageKey: 'page',
        pageSizeKey: 'pageSize',
      },
    });

  const { data: meta } = useAdminResourceMeta<Record<string, AdminChoiceOption[]>>(
    config.resource,
    config.metaResource,
  );

  const filterSignature = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [search, filterSignature, sortModel, setPaginationModel]);

  const queryParams = useMemo<AdminListParams>(() => {
    const params: AdminListParams = {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel),
      search,
    };

    (config.filters ?? []).forEach((filter) => {
      const value = filters[filter.name];

      if (autocompleteFieldKinds.includes(filter.kind as AdminAutocompleteFieldKind)) {
        params[filter.name] = value?.id;
      } else if (filter.kind === 'nullableBoolean') {
        params[filter.name] = value === '' || value === undefined ? undefined : value === 'true';
      } else if (filter.kind === 'number') {
        params[filter.name] = value === '' || value === undefined ? undefined : Number(value);
      } else {
        params[filter.name] = value;
      }
    });

    return params;
  }, [config.filters, search, filters, pageParams.page, pageParams.pageSize, sortModel]);

  const { data, isLoading, isValidating, mutate } = useAdminResourceList<AdminSimpleRow>(
    config.resource,
    queryParams,
  );

  const selectedIds = useMemo(
    () =>
      Array.from(rowSelectionModel.ids)
        .map((id) => Number(id))
        .filter(Number.isFinite),
    [rowSelectionModel],
  );

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const runBatchAction = async (ids: Array<number | string>, action: AdminResourceAction) => {
    if (ids.length === 0) {
      return;
    }

    if (action.confirmKey && !(await confirm(t(action.confirmKey, { count: ids.length })))) {
      return;
    }

    setIsBatching(true);
    try {
      await batchAdminResources(config.resource, { ids, action: action.action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };

  const handleDelete = async (row: AdminSimpleRow) => {
    if (!(await confirm(t(config.confirmDeleteKey, getRowLabelParams(row))))) {
      return;
    }

    await removeAdminResource(config.resource, row.id);
    await mutate();
  };

  return {
    search,
    setSearch,
    filters,
    setFilters,
    rowSelectionModel,
    setRowSelectionModel,
    isBatching,
    sortModel,
    setSortModel,
    paginationModel,
    onPaginationModelChange,
    meta,
    data,
    isLoading,
    isValidating,
    selectedIds,
    resetRowSelection,
    runBatchAction,
    handleDelete,
  };
};
