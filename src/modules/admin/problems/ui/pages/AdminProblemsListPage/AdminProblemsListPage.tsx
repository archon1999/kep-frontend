import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getResourceById, resources } from 'app/routes/resources';
import {
  problemRatingRange,
  useAdminProblemsListPage,
} from 'modules/admin/problems/application/hooks/useAdminProblemsListPage';
import { AdminProblem } from 'modules/admin/problems/domain/types';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import AdminDataGridSkeletonLoadingOverlay from 'modules/admin/shared/ui/AdminDataGridSkeletonLoadingOverlay';
import AdminFiltersToolbar from 'modules/admin/shared/ui/AdminFiltersToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import { UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { getDifficultyColor, getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import DataGridNoRowsOverlay, {
  getDataGridNoRowsOverlaySlotProps,
} from 'shared/components/common/DataGridNoRowsOverlay';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterRangeField,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';

const getProblemRowHeight = () => 'auto' as const;

const AdminProblemsListPage = () => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const {
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
  } = useAdminProblemsListPage(confirm);

  const { t } = useTranslation();
  const filterDrawer = useFilterDrawer();

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
      field: 'groups',
      headerName: t('problems.groups'),
      minWidth: 220,
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => {
        const groups = (row.groups ?? []).map(
          (groupId) => groupById.get(groupId) ?? String(groupId),
        );

        if (groups.length === 0) {
          return <Typography color="text.secondary">{t('admin.emptyValue')}</Typography>;
        }

        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {groups.slice(0, 2).map((group) => (
              <Chip key={group} size="small" label={group} variant="outlined" />
            ))}
            {groups.length > 2 ? <Chip size="small" label={`+${groups.length - 2}`} /> : null}
          </Stack>
        );
      },
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
        options={meta?.groups ?? []}
        value={selectedGroupOptions}
        getOptionLabel={(option) => option.name}
        onChange={(_, value) => setSelectedGroups(value.map((group) => group.id))}
        renderInput={(params) => (
          <TextField {...params} fullWidth label={t('problems.groups')} placeholder="" />
        )}
      />

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
          <TextField {...params} fullWidth label={t('admin.filters.difficulty')} placeholder="" />
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
        placeholder={''}
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
    <>
      {confirmationDialog}
      {
        <AdminListPageLayout
          title={t('admin.problems.title')}
          createPath={resources.AdminProblemCreate}
          createLabel={t('admin.problems.createButton')}
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('admin.problems.searchPlaceholder')}
          filterDrawerOpen={filterDrawer.open}
          filterAnchorEl={filterDrawer.anchorEl}
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
            getRowHeight={getProblemRowHeight}
            sx={{ '& .MuiDataGrid-cell': { py: 1, minHeight: 56 } }}
            rows={data?.data ?? []}
            rowCount={rowCount}
            loading={isGridLoading}
            slots={{
              loadingOverlay: AdminDataGridSkeletonLoadingOverlay,
              noRowsOverlay: DataGridNoRowsOverlay,
            }}
            localeText={{ noRowsLabel: t('common.dataGrid.noRows.adminProblems') }}
            slotProps={getDataGridNoRowsOverlaySlotProps({
              filtered: Boolean(search || activeFilters.length),
            })}
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
      }
    </>
  );
};

export default AdminProblemsListPage;
