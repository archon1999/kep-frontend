import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  batchAdminContest,
  removeAdminContest,
  updateAdminContest,
} from 'modules/admin/contests/application/mutations';
import { useAdminContestMeta, useAdminContests } from 'modules/admin/contests/application/queries';
import { AdminContest } from 'modules/admin/contests/domain/types';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import { getOrderingFromSortModel } from 'modules/admin/shared/utils/gridSorting';
import useGridPagination from 'shared/hooks/useGridPagination';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import type { RowSelection as GridRowSelectionModel } from 'shared/lib/grid-state';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';

export const useAdminContestsListPage = (confirm: (message: string) => Promise<boolean>) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');

  const [typeFilter, setTypeFilter] = useState('');

  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');

  const [participationTypeFilter, setParticipationTypeFilter] = useState<number | ''>('');

  const [ratedFilter, setRatedFilter] = useState('');

  const [privateFilter, setPrivateFilter] = useState('');

  const [creatorFilter, setCreatorFilter] = useState<AdminAutocompleteOption | null>(null);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const [isBatching, setIsBatching] = useState(false);

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'startTime', sort: 'desc' }]);

  const { paginationModel, onPaginationModelChange, pageParams, setPaginationModel } =
    useGridPagination({
      initialPageSize: 20,
      querySync: {
        pageKey: 'page',
        pageSizeKey: 'pageSize',
      },
    });

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [
    search,
    typeFilter,
    categoryFilter,
    participationTypeFilter,
    ratedFilter,
    privateFilter,
    creatorFilter?.id,
    sortModel,
    setPaginationModel,
  ]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel),
      search,
      type: typeFilter || undefined,
      category: categoryFilter || undefined,
      participationType: participationTypeFilter || undefined,
      isRated: ratedFilter ? ratedFilter === 'true' : undefined,
      private: privateFilter ? privateFilter === 'true' : undefined,
      creator: creatorFilter?.id,
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      sortModel,
      search,
      typeFilter,
      categoryFilter,
      participationTypeFilter,
      ratedFilter,
      privateFilter,
      creatorFilter?.id,
    ],
  );

  const { data, isLoading, isValidating, mutate } = useAdminContests(queryParams);

  const { data: meta } = useAdminContestMeta();

  const isGridLoading = isLoading || (isValidating && !data?.data);

  const rowCount = useStableGridRowCount(data?.total, isGridLoading);

  const handleSearchChange = (value: string) => setSearch(value);

  const selectedIds = useMemo(
    () =>
      Array.from(rowSelectionModel.ids)
        .map((id) => Number(id))
        .filter(Number.isFinite),
    [rowSelectionModel],
  );

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const handleClearFilters = () => {
    setTypeFilter('');
    setCategoryFilter('');
    setParticipationTypeFilter('');
    setRatedFilter('');
    setPrivateFilter('');
    setCreatorFilter(null);
  };

  const handleDelete = async (contest: AdminContest) => {
    if (!(await confirm(t('admin.contests.confirmDelete', { id: contest.id })))) {
      return;
    }

    await removeAdminContest(contest.id);
    await mutate();
  };

  const handlePrivateChange = async (contest: AdminContest, isPrivate: boolean) => {
    await updateAdminContest(contest.id, { private: isPrivate });
    await mutate();
  };

  const handleBatchAction = async (
    action: 'delete' | 'showProblems' | 'hideProblems' | 'updatePerformance',
  ) => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmKey =
      action === 'delete'
        ? 'admin.contests.confirmBatchDelete'
        : action === 'updatePerformance'
          ? 'admin.contests.confirmBatchUpdatePerformance'
          : null;

    if (confirmKey && !(await confirm(t(confirmKey, { count: selectedIds.length })))) {
      return;
    }

    setIsBatching(true);
    try {
      await batchAdminContest({ ids: selectedIds, action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };

  const handleContestAction = async (
    contest: AdminContest,
    action: 'showProblems' | 'hideProblems' | 'updatePerformance',
  ) => {
    if (
      action === 'updatePerformance' &&
      !(await confirm(t('admin.contests.confirmUpdatePerformance', { id: contest.id })))
    ) {
      return;
    }

    await batchAdminContest({ ids: [contest.id], action });
    await mutate();
  };
  return {
    paginationModel,
    onPaginationModelChange,
    data,
    meta,
    rowCount,
    handleDelete,
    handlePrivateChange,
    handleBatchAction,
    handleContestAction,
    isGridLoading,
    selectedIds,
    isBatching,
    resetRowSelection,
    search,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    participationTypeFilter,
    setParticipationTypeFilter,
    ratedFilter,
    setRatedFilter,
    privateFilter,
    setPrivateFilter,
    creatorFilter,
    setCreatorFilter,
    sortModel,
    setSortModel,
    handleSearchChange,
    rowSelectionModel,
    setRowSelectionModel,
    handleClearFilters,
  };
};
