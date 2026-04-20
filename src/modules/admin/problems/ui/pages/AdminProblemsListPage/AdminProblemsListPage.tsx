import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContext, TabList } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Link,
  Menu,
  Stack,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router';
import SearchTextField from 'app/layouts/main-layout/common/search-box/SearchTextField';
import { getResourceById, resources } from 'app/routes/resources';
import { AdminAutocompleteOption, UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import { getDifficultyColor, getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminProblemMeta, useAdminProblems } from 'modules/admin/problems/application/queries';
import { problemsAdminClient } from 'modules/admin/problems/data-access/problemsAdminClient';
import { AdminProblem } from 'modules/admin/problems/domain/types';

const orderingOptions = [
  { label: 'problems.orderOldest', value: 'id' },
  { label: 'problems.orderNewest', value: '-id' },
  { label: 'problems.orderEasiest', value: 'problemRating,-solved' },
  { label: 'problems.orderHardest', value: '-problemRating,solved' },
  { label: 'problems.orderMostSolved', value: '-solved' },
  { label: 'problems.orderLeastSolved', value: 'solved' },
];

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
  const [ordering, setOrdering] = useState('-id');
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<HTMLElement | null>(null);
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
    ordering,
    setPaginationModel,
  ]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering,
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
      ordering,
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

  const tagById = useMemo(
    () => new Map((meta?.tags ?? []).map((tag) => [tag.id, tag.name])),
    [meta?.tags],
  );

  const filtersOpen = Boolean(filtersAnchorEl);
  const handleOrderingChange = (_: SyntheticEvent, value: string) => setOrdering(value);
  const handleFiltersToggle = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchorEl((current) => (current ? null : event.currentTarget));
  };
  const handleFiltersClose = () => setFiltersAnchorEl(null);

  const handleClearFilters = () => {
    setSelectedDifficulties([]);
    setProblemRatingMin('');
    setProblemRatingMax('');
    setHiddenFilter(null);
    setAuthorFilter(null);
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

  return (
    <AdminListPageLayout
      title={t('admin.problems.title')}
      createPath={resources.AdminProblemCreate}
      search={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('admin.problems.searchPlaceholder')}
      toolbar={
        <>
          <Stack direction="column" spacing={2}>
            <TabContext value={ordering}>
              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                alignItems={{ lg: 'center' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                  <TabList
                    onChange={handleOrderingChange}
                    aria-label={t('admin.problems.orderingTabs')}
                    allowScrollButtonsMobile
                  >
                    {orderingOptions.map((option) => (
                      <Tab key={option.value} label={t(option.label)} value={option.value} />
                    ))}
                  </TabList>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.25}
                  alignItems={{ sm: 'center' }}
                >
                  <FilterButton
                    id="admin-problems-filters-button"
                    onClick={handleFiltersToggle}
                    label={t('problems.filters')}
                    badgeContent={activeFilters.length}
                    aria-haspopup="true"
                    aria-expanded={filtersOpen ? 'true' : undefined}
                    aria-controls={filtersOpen ? 'admin-problems-filters-menu' : undefined}
                  />
                  <SearchTextField
                    sx={{ minWidth: 100 }}
                    value={search}
                    placeholder={t('admin.problems.searchPlaceholder')}
                    onChange={handleSearchChange}
                  />
                </Stack>
              </Stack>
            </TabContext>

            {activeFilters.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('problems.appliedFilters', { count: activeFilters.length })}
                </Typography>
                {activeFilters.map((item) => (
                  <Chip
                    key={item.key}
                    size="small"
                    label={item.label}
                    onDelete={item.onRemove}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                <Button variant="text" size="small" color="secondary" onClick={handleClearFilters}>
                  {t('problems.clearFilters')}
                </Button>
              </Stack>
            )}
          </Stack>

          <Menu
            id="admin-problems-filters-menu"
            anchorEl={filtersAnchorEl}
            open={filtersOpen}
            onClose={handleFiltersClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            MenuListProps={{ disablePadding: true }}
            PaperProps={{
              sx: {
                p: 2.5,
                width: { xs: 320, sm: 420 },
              },
            }}
          >
            <Stack direction="column" spacing={2.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconifyIcon icon="mdi:tune-variant" width={20} height={20} />
                  <Typography variant="subtitle2" fontWeight={700}>
                    {t('problems.filters')}
                  </Typography>
                </Stack>
                <Button size="small" variant="text" color="secondary" onClick={handleClearFilters}>
                  {t('problems.clearFilters')}
                </Button>
              </Stack>

              <Autocomplete
                multiple
                disableCloseOnSelect
                options={difficultyFilterOptions}
                value={selectedDifficultyOptions}
                getOptionLabel={(option) => option.label}
                onChange={(_, value) =>
                  setSelectedDifficulties(value.map((difficulty) => difficulty.value))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    variant="filled"
                    label={t('admin.filters.difficulty')}
                  />
                )}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  variant="filled"
                  label={t('admin.filters.ratingMin')}
                  value={problemRatingMin}
                  onChange={(event) => setProblemRatingMin(event.target.value)}
                />
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  variant="filled"
                  label={t('admin.filters.ratingMax')}
                  value={problemRatingMax}
                  onChange={(event) => setProblemRatingMax(event.target.value)}
                />
              </Stack>

              <UsersAutocomplete
                value={authorFilter}
                onChange={setAuthorFilter}
                label={t('admin.filters.author')}
                placeholder={t('admin.form.placeholders.username')}
                textFieldProps={{ size: 'small', variant: 'filled' }}
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
          </Menu>
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
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        disableColumnSorting
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
