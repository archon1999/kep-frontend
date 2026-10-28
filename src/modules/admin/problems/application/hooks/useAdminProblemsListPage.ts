import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  batchAdminProblem,
  removeAdminProblem,
  updateAdminProblem,
} from 'modules/admin/problems/application/mutations';
import { useAdminProblemMeta, useAdminProblems } from 'modules/admin/problems/application/queries';
import { AdminProblem } from 'modules/admin/problems/domain/types';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import { getOrderingFromSortModel } from 'modules/admin/shared/utils/gridSorting';
import { getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import useGridPagination from 'shared/hooks/useGridPagination';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import type { RowSelection as GridRowSelectionModel } from 'shared/lib/grid-state';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';

export const problemRatingRange = {
  min: 100,
  max: 3000,
  step: 100,
};

const problemOrderingFieldMap = {
  problemRating: 'problem_rating',
  solvedCount: 'solved_count',
};

const formatProblemRatingBand = (min?: string, max?: string) => {
  if (min && max) {
    return `${min}-${max}`;
  }
  if (min) {
    return `${min}+`;
  }
  if (max) {
    return `<= ${max}`;
  }
  return '';
};

export const useAdminProblemsListPage = (confirm: (message: string) => Promise<boolean>) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');

  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);

  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  const [problemRatingMin, setProblemRatingMin] = useState('');

  const [problemRatingMax, setProblemRatingMax] = useState('');

  const [hiddenFilter, setHiddenFilter] = useState<boolean | null>(null);

  const [authorFilter, setAuthorFilter] = useState<AdminAutocompleteOption | null>(null);

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const [isBatching, setIsBatching] = useState(false);

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
    selectedDifficulties,
    selectedGroups,
    problemRatingMin,
    problemRatingMax,
    hiddenFilter,
    authorFilter?.id,
    sortModel,
    setPaginationModel,
  ]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel, problemOrderingFieldMap),
      search,
      difficulty: selectedDifficulties,
      groups: selectedGroups,
      problemRatingMin: problemRatingMin ? Number(problemRatingMin) : undefined,
      problemRatingMax: problemRatingMax ? Number(problemRatingMax) : undefined,
      hidden: hiddenFilter,
      author: authorFilter?.id,
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      sortModel,
      search,
      selectedDifficulties,
      selectedGroups,
      problemRatingMin,
      problemRatingMax,
      hiddenFilter,
      authorFilter?.id,
    ],
  );

  const { data, isLoading, isValidating, mutate } = useAdminProblems(queryParams);

  const { data: meta } = useAdminProblemMeta();

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

  const difficultyFilterOptions = useMemo(
    () =>
      (meta?.difficulties ?? []).map((difficulty) => {
        const value = Number(difficulty.value);
        const labelKey = getDifficultyLabelKey(value);

        return {
          value,
          label: labelKey ? t(labelKey) : String(difficulty.label),
        };
      }),
    [meta?.difficulties, t],
  );

  const selectedDifficultyOptions = useMemo(
    () =>
      difficultyFilterOptions.filter((difficulty) =>
        selectedDifficulties.includes(difficulty.value),
      ),
    [difficultyFilterOptions, selectedDifficulties],
  );

  const problemRatingRangeValue = useMemo<[number, number]>(() => {
    const min = Number(problemRatingMin);
    const max = Number(problemRatingMax);
    const normalizedMin = Number.isFinite(min) && min > 0 ? min : problemRatingRange.min;
    const normalizedMax = Number.isFinite(max) && max > 0 ? max : problemRatingRange.max;

    return [
      Math.max(problemRatingRange.min, Math.min(normalizedMin, normalizedMax)),
      Math.min(problemRatingRange.max, Math.max(normalizedMin, normalizedMax)),
    ];
  }, [problemRatingMax, problemRatingMin]);

  const tagById = useMemo(
    () => new Map((meta?.tags ?? []).map((tag) => [tag.id, tag.name])),
    [meta?.tags],
  );

  const groupById = useMemo(
    () => new Map((meta?.groups ?? []).map((group) => [group.id, group.name])),
    [meta?.groups],
  );

  const selectedGroupOptions = useMemo(
    () => (meta?.groups ?? []).filter((group) => selectedGroups.includes(group.id)),
    [meta?.groups, selectedGroups],
  );

  const handleClearFilters = () => {
    setSelectedDifficulties([]);
    setSelectedGroups([]);
    setProblemRatingMin('');
    setProblemRatingMax('');
    setHiddenFilter(null);
    setAuthorFilter(null);
  };

  const handleProblemRatingRangeChange = (_event: Event, value: number | number[]) => {
    if (!Array.isArray(value)) return;

    const [min, max] = value;
    setProblemRatingMin(min > problemRatingRange.min ? String(min) : '');
    setProblemRatingMax(max < problemRatingRange.max ? String(max) : '');
  };

  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (selectedDifficultyOptions.length > 0) {
      items.push({
        key: 'difficulty',
        label: `${t('admin.filters.difficulty')}: ${selectedDifficultyOptions
          .map((difficulty) => difficulty.label)
          .join(', ')}`,
        onRemove: () => setSelectedDifficulties([]),
      });
    }

    if (problemRatingMin || problemRatingMax) {
      items.push({
        key: 'problem-rating',
        label: `${t('problems.problemRating')}: ${formatProblemRatingBand(
          problemRatingMin,
          problemRatingMax,
        )}`,
        onRemove: () => {
          setProblemRatingMin('');
          setProblemRatingMax('');
        },
      });
    }

    if (selectedGroupOptions.length > 0) {
      items.push({
        key: 'groups',
        label: `${t('problems.groups')}: ${selectedGroupOptions
          .map((group) => group.name)
          .join(', ')}`,
        onRemove: () => setSelectedGroups([]),
      });
    }

    if (hiddenFilter !== null) {
      items.push({
        key: 'hidden',
        label: hiddenFilter ? t('admin.filters.hiddenOnly') : t('admin.filters.visibleOnly'),
        onRemove: () => setHiddenFilter(null),
      });
    }

    if (authorFilter) {
      items.push({
        key: 'author',
        label: `${t('admin.filters.author')}: ${authorFilter.username}`,
        onRemove: () => setAuthorFilter(null),
      });
    }

    return items;
  }, [
    authorFilter,
    hiddenFilter,
    problemRatingMax,
    problemRatingMin,
    selectedDifficultyOptions,
    selectedGroupOptions,
    t,
  ]);

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const handleDelete = async (problem: AdminProblem) => {
    if (!(await confirm(t('admin.problems.confirmDelete', { id: problem.id })))) {
      return;
    }

    await removeAdminProblem(problem.id);
    await mutate();
  };

  const handleHiddenChange = async (problem: AdminProblem, hidden: boolean) => {
    await updateAdminProblem(problem.id, { hidden });
    await mutate();
  };

  const handleBatchAction = async (action: 'delete' | 'show' | 'hide') => {
    if (selectedIds.length === 0) {
      return;
    }

    if (
      action === 'delete' &&
      !(await confirm(t('admin.problems.confirmBatchDelete', { count: selectedIds.length })))
    ) {
      return;
    }

    setIsBatching(true);
    try {
      await batchAdminProblem({ ids: selectedIds, action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };

  const cycleHiddenFilter = () => {
    setHiddenFilter((prev) => (prev === null ? true : prev ? false : null));
  };

  const hiddenFilterLabel =
    hiddenFilter === null
      ? t('admin.filters.hiddenAll')
      : hiddenFilter
        ? t('admin.filters.hiddenOnly')
        : t('admin.filters.visibleOnly');
  return {
    paginationModel,
    onPaginationModelChange,
    data,
    meta,
    rowCount,
    handleDelete,
    handleHiddenChange,
    handleBatchAction,
    isGridLoading,
    difficultyFilterOptions,
    selectedDifficultyOptions,
    tagById,
    groupById,
    selectedGroupOptions,
    activeFilters,
    selectedIds,
    isBatching,
    resetRowSelection,
    search,
    setSelectedDifficulties,
    setSelectedGroups,
    hiddenFilter,
    authorFilter,
    setAuthorFilter,
    sortModel,
    setSortModel,
    handleSearchChange,
    rowSelectionModel,
    setRowSelectionModel,
    problemRatingRangeValue,
    handleClearFilters,
    handleProblemRatingRangeChange,
    cycleHiddenFilter,
    hiddenFilterLabel,
  };
};
