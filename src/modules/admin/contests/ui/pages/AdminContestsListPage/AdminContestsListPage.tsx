import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Checkbox, Chip, Link, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getResourceById, resources } from 'app/routes/resources';
import { useAdminContestsListPage } from 'modules/admin/contests/application/hooks/useAdminContestsListPage';
import { AdminContest } from 'modules/admin/contests/domain/types';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import { AdminChoiceSelect } from 'modules/admin/shared/ui/AdminChoiceSelects';
import AdminDataGridSkeletonLoadingOverlay from 'modules/admin/shared/ui/AdminDataGridSkeletonLoadingOverlay';
import AdminDateTimeDisplay from 'modules/admin/shared/ui/AdminDateTimeDisplay';
import AdminFiltersToolbar, {
  AdminActiveFilter,
} from 'modules/admin/shared/ui/AdminFiltersToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import { UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import DataGridNoRowsOverlay, {
  getDataGridNoRowsOverlaySlotProps,
} from 'shared/components/common/DataGridNoRowsOverlay';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';

const AdminContestsListPage = () => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const {
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
  } = useAdminContestsListPage(confirm);

  const { t } = useTranslation();
  const filterDrawer = useFilterDrawer();

  const activeFilters = useMemo<AdminActiveFilter[]>(() => {
    const items: AdminActiveFilter[] = [];

    if (typeFilter) {
      items.push({
        key: 'type',
        label: `${t('admin.form.fields.type')}: ${
          meta?.types.find((type) => type.value === typeFilter)?.label ?? typeFilter
        }`,
        onRemove: () => setTypeFilter(''),
      });
    }

    if (categoryFilter !== '') {
      items.push({
        key: 'category',
        label: `${t('admin.form.fields.category')}: ${
          meta?.categories.find((category) => category.value === categoryFilter)?.label ??
          categoryFilter
        }`,
        onRemove: () => setCategoryFilter(''),
      });
    }

    if (participationTypeFilter !== '') {
      items.push({
        key: 'participation',
        label: `${t('admin.form.fields.participation')}: ${
          meta?.participationTypes.find(
            (participationType) => participationType.value === participationTypeFilter,
          )?.label ?? participationTypeFilter
        }`,
        onRemove: () => setParticipationTypeFilter(''),
      });
    }

    if (ratedFilter) {
      items.push({
        key: 'rated',
        label: `${t('admin.form.fields.rated')}: ${
          ratedFilter === 'true' ? t('admin.status.yes') : t('admin.status.no')
        }`,
        onRemove: () => setRatedFilter(''),
      });
    }

    if (privateFilter) {
      items.push({
        key: 'private',
        label: `${t('admin.form.fields.private')}: ${
          privateFilter === 'true' ? t('admin.status.yes') : t('admin.status.no')
        }`,
        onRemove: () => setPrivateFilter(''),
      });
    }

    if (creatorFilter) {
      items.push({
        key: 'creator',
        label: `${t('admin.form.fields.creator')}: ${creatorFilter.username ?? `#${creatorFilter.id}`}`,
        onRemove: () => setCreatorFilter(null),
      });
    }

    return items;
  }, [
    categoryFilter,
    creatorFilter,
    meta,
    participationTypeFilter,
    privateFilter,
    ratedFilter,
    t,
    typeFilter,
  ]);

  const columns: GridColDef<AdminContest>[] = [
    {
      field: 'id',
      headerName: t('admin.columns.id'),
      width: 90,
      renderCell: ({ row }) => (
        <Link
          component={RouterLink}
          to={getResourceById(resources.AdminContestEdit, row.id)}
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
          to={getResourceById(resources.Contest, row.id)}
          underline="hover"
          color="text.primary"
          onClick={(event) => event.stopPropagation()}
        >
          <Typography variant="body2" fontWeight={600} noWrap>
            {row.title || t('admin.emptyValue')}
          </Typography>
        </Link>
      ),
    },
    {
      field: 'type',
      headerName: t('admin.columns.type'),
      width: 130,
      renderCell: ({ row }) => <Chip size="small" label={row.type} variant="soft" />,
    },
    {
      field: 'startTime',
      headerName: t('admin.columns.start'),
      width: 190,
      renderCell: ({ row }) => (
        <AdminDateTimeDisplay value={row.startTime} emptyValue={t('admin.emptyValue')} />
      ),
    },
    {
      field: 'finishTime',
      headerName: t('admin.columns.finish'),
      width: 190,
      renderCell: ({ row }) => (
        <AdminDateTimeDisplay value={row.finishTime} emptyValue={t('admin.emptyValue')} />
      ),
    },
    {
      field: 'private',
      headerName: t('admin.columns.private'),
      width: 120,
      renderCell: ({ row }) => (
        <Checkbox
          checked={row.private}
          onChange={(event) => handlePrivateChange(row, event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          slotProps={{ input: { 'aria-label': t('admin.columns.private') } }}
        />
      ),
    },
    {
      field: 'creatorUsername',
      headerName: t('admin.columns.creator'),
      width: 180,
      sortable: false,
      renderCell: ({ row }) =>
        row.creatorUsername ? (
          <UserPopover username={row.creatorUsername}>
            <Typography color="primary" fontWeight={600} variant="body2" noWrap>
              {row.creatorUsername}
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
              to: getResourceById(resources.AdminContestEdit, row.id),
            },
            {
              label: t('admin.actions.showProblems'),
              icon: 'mdi:eye-outline',
              onClick: () => handleContestAction(row, 'showProblems'),
            },
            {
              label: t('admin.actions.hideProblems'),
              icon: 'mdi:eye-off-outline',
              onClick: () => handleContestAction(row, 'hideProblems'),
            },
            {
              label: t('admin.actions.updatePerformance'),
              icon: 'mdi:speedometer',
              onClick: () => handleContestAction(row, 'updatePerformance'),
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
      <AdminChoiceSelect
        label={t('admin.form.fields.type')}
        value={typeFilter}
        onChange={(value) => setTypeFilter(String(value))}
        options={meta?.types ?? []}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.category')}
        value={categoryFilter}
        onChange={(value) => setCategoryFilter(value === '' ? '' : Number(value))}
        options={meta?.categories ?? []}
        nullable
        emptyLabel={t('admin.filters.all')}
        valueType="number"
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.participation')}
        value={participationTypeFilter}
        onChange={(value) => setParticipationTypeFilter(value === '' ? '' : Number(value))}
        options={meta?.participationTypes ?? []}
        nullable
        emptyLabel={t('admin.filters.all')}
        valueType="number"
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.rated')}
        value={ratedFilter}
        onChange={(value) => setRatedFilter(String(value))}
        options={[
          { value: 'true', label: t('admin.status.yes') },
          { value: 'false', label: t('admin.status.no') },
        ]}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.private')}
        value={privateFilter}
        onChange={(value) => setPrivateFilter(String(value))}
        options={[
          { value: 'true', label: t('admin.status.yes') },
          { value: 'false', label: t('admin.status.no') },
        ]}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
      <UsersAutocomplete
        value={creatorFilter}
        onChange={setCreatorFilter}
        label={t('admin.form.fields.creator')}
        placeholder={''}
      />
    </Stack>
  );

  return (
    <>
      {confirmationDialog}
      {
        <AdminListPageLayout
          title={t('admin.contests.title')}
          createPath={resources.AdminContestCreate}
          createLabel={t('admin.contests.createButton')}
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('admin.contests.searchPlaceholder')}
          filterDrawerOpen={filterDrawer.open}
          filterAnchorEl={filterDrawer.anchorEl}
          filterDrawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
          filterDrawer={
            <FilterDrawer
              id="admin-contests-filters-drawer"
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
            <AdminFiltersToolbar
              id="admin-contests"
              search={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder={t('admin.contests.searchPlaceholder')}
              activeFilters={activeFilters}
              onClearFilters={handleClearFilters}
              filters={filterControls}
              filtersOpen={filterDrawer.open}
              onToggleFilters={filterDrawer.toggle}
            />
          }
        >
          <AdminBatchActionsToolbar
            selectedCount={selectedIds.length}
            selectedLabel={t('admin.selectedContests')}
            disabled={isBatching}
            onClear={resetRowSelection}
            actions={[
              {
                label: t('admin.actions.showProblems'),
                icon: 'mdi:eye-outline',
                onClick: () => handleBatchAction('showProblems'),
              },
              {
                label: t('admin.actions.hideProblems'),
                icon: 'mdi:eye-off-outline',
                onClick: () => handleBatchAction('hideProblems'),
              },
              {
                label: t('admin.actions.updatePerformance'),
                icon: 'mdi:speedometer',
                onClick: () => handleBatchAction('updatePerformance'),
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
            rowCount={rowCount}
            loading={isGridLoading}
            slots={{
              loadingOverlay: AdminDataGridSkeletonLoadingOverlay,
              noRowsOverlay: DataGridNoRowsOverlay,
            }}
            localeText={{ noRowsLabel: t('common.dataGrid.noRows.adminContests') }}
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

export default AdminContestsListPage;
