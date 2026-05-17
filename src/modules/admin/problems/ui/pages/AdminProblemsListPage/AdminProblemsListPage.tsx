import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router';
import AdminDataGridSkeletonLoadingOverlay from 'modules/admin/shared/ui/AdminDataGridSkeletonLoadingOverlay';
import { getResourceById, resources } from 'app/routes/resources';
import { AdminAutocompleteOption, UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import { getDifficultyColor, getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import AdminFiltersToolbar from 'modules/admin/shared/ui/AdminFiltersToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { getOrderingFromSortModel } from 'modules/admin/shared/utils/gridSorting';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterRangeField,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminProblemMeta, useAdminProblems } from 'modules/admin/problems/application/queries';
import { problemsAdminClient } from 'modules/admin/problems/data-access/problemsAdminClient';
import { AdminProblem } from 'modules/admin/problems/domain/types';

const problemRatingRange = {
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

const AdminProblemsListPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);
  const [problemRatingMin, setProblemRatingMin] = useState('');
  const [problemRatingMax, setProblemRatingMax] = useState('');
  const [hiddenFilter, setHiddenFilter] = useState<boolean | null>(null);
  const [authorFilter, setAuthorFilter] = useState<AdminAutocompleteOption | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);
  const filterDrawer = useFilterDrawer();
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
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [
    debouncedSearch,
    selectedDifficulties,
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
      search: debouncedSearch,
      difficulty: selectedDifficulties,
      problemRatingMin: problemRatingMin ? Number(problemRatingMin) : undefined,
      problemRatingMax: problemRatingMax ? Number(problemRatingMax) : undefined,
      hidden: hiddenFilter,
      author: authorFilter?.id,
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      sortModel,
      debouncedSearch,
      selectedDifficulties,
      problemRatingMin,
      problemRatingMax,
      hiddenFilter,
      authorFilter?.id,
    ],
  );

  const { data, isLoading, isValidating, mutate } = useAdminProblems(queryParams);
  const { data: meta } = useAdminProblemMeta();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const selectedIds = useMemo(
    () => Array.from(rowSelectionModel.ids).map((id) => Number(id)).filter(Number.isFinite),
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
    () => difficultyFilterOptions.filter((difficulty) => selectedDifficulties.includes(difficulty.value)),
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

  const handleClearFilters = () => {
    setSelectedDifficulties([]);
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
  }, [authorFilter, hiddenFilter, problemRatingMax, problemRatingMin, selectedDifficultyOptions, t]);

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const handleDelete = async (problem: AdminProblem) => {
    if (!window.confirm(t('admin.problems.confirmDelete', { id: problem.id }))) {
      return;
    }

    await problemsAdminClient.remove(problem.id);
    await mutate();
  };

  const handleHiddenChange = async (problem: AdminProblem, hidden: boolean) => {
    await problemsAdminClient.update(problem.id, { hidden });
    await mutate();
  };

  const handleBatchAction = async (action: 'delete' | 'show' | 'hide') => {
    if (selectedIds.length === 0) {
      return;
    }

    if (action === 'delete' && !window.confirm(t('admin.problems.confirmBatchDelete', { count: selectedIds.length }))) {
      return;
    }

    setIsBatching(true);
    try {
      await problemsAdminClient.batch({ ids: selectedIds, action });
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

  const renderDifficultyBadge = (difficulty?: number) => {
    const labelKey = getDifficultyLabelKey(difficulty);

    return (
      <Chip
        size="small"
        label={labelKey ? t(labelKey) : (difficulty ?? t('admin.emptyValue'))}
        color={getDifficultyColor(difficulty)}
        variant="soft"
      />
    );
  };

  const columns: GridColDef<AdminProblem>[] = [
    {
      field: 'id',
      headerName: t('admin.columns.id'),
      width: 90,
      renderCell: ({ row }) => (
        <Link
          component={RouterLink}
          to={getResourceById(resources.AdminProblemEdit, row.id)}
          underline="hover"
          fontWeight={700}
          onClick={(event) => event.stopPropagation()}
        >
          {row.id}
        </Link>
      ),
    },
    {
      field: 'title',
      headerName: t('admin.columns.title'),
      minWidth: 260,
      flex: 1,
      renderCell: ({ row }) => (
        <Link
          component={RouterLink}
          to={getResourceById(resources.Problem, row.id)}
          underline="hover"
          color="text.primary"
          onClick={(event) => event.stopPropagation()}
        >
          <Typography variant="body2" fontWeight={600} noWrap>
            {row.title || row.titleUz || row.titleEn || row.titleRu || t('admin.emptyValue')}
          </Typography>
        </Link>
      ),
    },
    {
      field: 'authorUsername',
      headerName: t('admin.columns.author'),
      width: 180,
      sortable: false,
      renderCell: ({ row }) =>
        row.authorUsername ? (
          <UserPopover username={row.authorUsername}>
            <Typography color="primary" fontWeight={600} variant="body2" noWrap>
              {row.authorUsername}
            </Typography>
          </UserPopover>
        ) : (
          <Typography color="text.secondary">{t('admin.emptyValue')}</Typography>
        ),
    },
    {
      field: 'difficulty',
      headerName: t('admin.columns.difficulty'),
      width: 130,
      renderCell: ({ row }) => renderDifficultyBadge(row.difficulty),
    },
    {
      field: 'tags',
      headerName: t('admin.columns.tags'),
      minWidth: 220,
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => {
        const tags = (row.tags ?? []).map((tagId) => tagById.get(tagId) ?? String(tagId));

        if (tags.length === 0) {
          return <Typography color="text.secondary">{t('admin.emptyValue')}</Typography>;
        }

        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {tags.slice(0, 3).map((tag) => (
              <Chip key={tag} size="small" label={tag} variant="soft" />
            ))}
            {tags.length > 3 ? <Chip size="small" label={`+${tags.length - 3}`} /> : null}
          </Stack>
        );
      },
    },
    {
      field: 'problemRating',
      headerName: t('admin.columns.rating'),
      width: 120,
      renderCell: ({ row }) => (
        <Typography color="primary" fontWeight={700} variant="body2">
          {row.problemRating ?? t('admin.emptyValue')}
        </Typography>
      ),
    },
    {
      field: 'hidden',
      headerName: t('admin.columns.hidden'),
      width: 110,
      renderCell: ({ row }) => (
        <Checkbox
          checked={row.hidden}
          onChange={(event) => handleHiddenChange(row, event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          slotProps={{ input: { 'aria-label': t('admin.columns.hidden') } }}
        />
      ),
    },
    {
      field: 'solvedCount',
      headerName: t('admin.columns.worked'),
      width: 140,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography color="success.main" fontWeight={700} variant="body2">
            {row.solvedCount ?? 0}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            /
          </Typography>
          <Typography color="error.main" fontWeight={700} variant="body2">
            {row.unsolvedCount ?? 0}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'actions',
      headerName: t('admin.columns.actions'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <AdminRowActions
          label={t('admin.columns.actions')}
          actions={[
            {
              label: t('admin.actions.edit'),
              icon: 'mdi:pencil-outline',
              to: getResourceById(resources.AdminProblemEdit, row.id),
            },
            {
              label: t('admin.actions.show'),
              icon: 'mdi:eye-outline',
              disabled: !row.hidden,
              onClick: () => handleHiddenChange(row, false),
            },
            {
              label: t('admin.actions.hide'),
              icon: 'mdi:eye-off-outline',
              disabled: row.hidden,
              onClick: () => handleHiddenChange(row, true),
            },
            {
              label: t('admin.actions.delete'),
              icon: 'mdi:delete-outline',
              color: 'error',
              onClick: () => handleDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  const filterControls = (
    <Stack direction="column" spacing={2.5}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={difficultyFilterOptions}
        value={selectedDifficultyOptions}
        getOptionLabel={(option) => option.label}
        onChange={(_, value) => setSelectedDifficulties(value.map((difficulty) => difficulty.value))}
        renderInput={(params) => (
          <TextField {...params} fullWidth label={t('admin.filters.difficulty')} />
        )}
      />

      <FilterRangeField
        label={t('problems.problemRating')}
        range={[problemRatingRange.min, problemRatingRange.max]}
        step={problemRatingRange.step}
        value={problemRatingRangeValue}
        onChange={handleProblemRatingRangeChange}
        valueText={(value) => String(value)}
      />

      <UsersAutocomplete
        value={authorFilter}
        onChange={setAuthorFilter}
        label={t('admin.filters.author')}
        placeholder={t('admin.form.placeholders.username')}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          {hiddenFilterLabel}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={hiddenFilter === true}
              indeterminate={hiddenFilter === null}
              onChange={cycleHiddenFilter}
              size="small"
              slotProps={{ input: { 'aria-label': hiddenFilterLabel } }}
            />
          }
          label={null}
          sx={{ m: 0 }}
        />
      </Stack>
    </Stack>
  );

  return (
    <AdminListPageLayout
      title={t('admin.problems.title')}
      createPath={resources.AdminProblemCreate}
      createLabel={t('admin.problems.createButton')}
      search={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('admin.problems.searchPlaceholder')}
      filterDrawerOpen={filterDrawer.open}
      filterDrawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
      filterDrawer={
        <FilterDrawer
          id="admin-problems-filters-drawer"
          open={filterDrawer.open}
          onClose={filterDrawer.close}
          drawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
          hasActiveFilters={activeFilters.length > 0}
          clearLabel={t('problems.clear')}
          onClear={handleClearFilters}
        >
          {filterControls}
        </FilterDrawer>
      }
      toolbar={
        <>
          <Stack direction="column" spacing={2}>
            <AdminFiltersToolbar
              id="admin-problems"
              search={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder={t('admin.problems.searchPlaceholder')}
              activeFilters={activeFilters}
              onClearFilters={handleClearFilters}
              filters={filterControls}
              filtersOpen={filterDrawer.open}
              onToggleFilters={filterDrawer.toggle}
            />
          </Stack>
        </>
      }
    >
      <AdminBatchActionsToolbar
        selectedCount={selectedIds.length}
        selectedLabel={t('admin.selectedProblems')}
        disabled={isBatching}
        onClear={resetRowSelection}
        actions={[
          {
            label: t('admin.actions.show'),
            icon: 'mdi:eye-outline',
            onClick: () => handleBatchAction('show'),
          },
          {
            label: t('admin.actions.hide'),
            icon: 'mdi:eye-off-outline',
            color: 'warning',
            onClick: () => handleBatchAction('hide'),
          },
          {
            label: t('admin.actions.delete'),
            icon: 'mdi:delete-outline',
            color: 'error',
            onClick: () => handleBatchAction('delete'),
          },
        ]}
      />
      <DataGrid
        autoHeight
        rows={data?.data ?? []}
        rowCount={data?.total ?? 0}
        loading={isLoading || isValidating}
        slots={{ loadingOverlay: AdminDataGridSkeletonLoadingOverlay }}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        sortingMode="server"
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        disableRowSelectionExcludeModel
        disableRowSelectionOnClick
      />
    </AdminListPageLayout>
  );
};

export default AdminProblemsListPage;
