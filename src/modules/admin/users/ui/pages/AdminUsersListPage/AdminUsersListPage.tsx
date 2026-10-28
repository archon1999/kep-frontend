import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getResourceById, resources } from 'app/routes/resources';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import { AdminChoiceSelect } from 'modules/admin/shared/ui/AdminChoiceSelects';
import AdminDataGridSkeletonLoadingOverlay from 'modules/admin/shared/ui/AdminDataGridSkeletonLoadingOverlay';
import AdminFiltersToolbar, {
  AdminActiveFilter,
} from 'modules/admin/shared/ui/AdminFiltersToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { useAdminUsersListPage } from 'modules/admin/users/application/hooks/useAdminUsersListPage';
import { AdminUser } from 'modules/admin/users/domain/types';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import DataGridNoRowsOverlay, {
  getDataGridNoRowsOverlaySlotProps,
} from 'shared/components/common/DataGridNoRowsOverlay';
import DialogHeader from 'shared/components/common/DialogHeader';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';

const AdminUsersListPage = () => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const {
    paginationModel,
    onPaginationModelChange,
    data,
    rowCount,
    handleDelete,
    handleActiveChange,
    handleChangePassword,
    handleBatchAction,
    isGridLoading,
    passwordDialogUser,
    password,
    setPassword,
    isChangingPassword,
    closePasswordDialog,
    selectedIds,
    isBatching,
    resetRowSelection,
    search,
    activeFilter,
    setActiveFilter,
    staffFilter,
    setStaffFilter,
    superuserFilter,
    setSuperuserFilter,
    canCreateProblemsFilter,
    setCanCreateProblemsFilter,
    sortModel,
    setSortModel,
    handleSearchChange,
    rowSelectionModel,
    setRowSelectionModel,
    handleClearFilters,
    openPasswordDialog,
  } = useAdminUsersListPage(confirm);

  const { t } = useTranslation();
  const filterDrawer = useFilterDrawer();

  const activeFilters = useMemo<AdminActiveFilter[]>(() => {
    const items: AdminActiveFilter[] = [];
    const booleanLabel = (value: string) =>
      value === 'true' ? t('admin.status.yes') : t('admin.status.no');

    if (activeFilter) {
      items.push({
        key: 'active',
        label: `${t('admin.form.fields.active')}: ${booleanLabel(activeFilter)}`,
        onRemove: () => setActiveFilter(''),
      });
    }

    if (staffFilter) {
      items.push({
        key: 'staff',
        label: `${t('admin.form.fields.staff')}: ${booleanLabel(staffFilter)}`,
        onRemove: () => setStaffFilter(''),
      });
    }

    if (superuserFilter) {
      items.push({
        key: 'superuser',
        label: `${t('admin.form.fields.superuser')}: ${booleanLabel(superuserFilter)}`,
        onRemove: () => setSuperuserFilter(''),
      });
    }

    if (canCreateProblemsFilter) {
      items.push({
        key: 'canCreateProblems',
        label: `${t('admin.form.fields.canCreateProblems')}: ${booleanLabel(canCreateProblemsFilter)}`,
        onRemove: () => setCanCreateProblemsFilter(''),
      });
    }

    return items;
  }, [activeFilter, canCreateProblemsFilter, staffFilter, superuserFilter, t]);

  const renderRating = (rating: number | string | undefined) => (
    <Typography color="primary" fontWeight={700} variant="body2">
      {rating ?? t('admin.emptyValue')}
    </Typography>
  );

  const columns: GridColDef<AdminUser>[] = [
    {
      field: 'id',
      headerName: t('admin.columns.id'),
      width: 90,
      renderCell: ({ row }) => (
        <Link
          component={RouterLink}
          to={getResourceById(resources.AdminUserEdit, row.id)}
          underline="hover"
          fontWeight={700}
          onClick={(event) => event.stopPropagation()}
        >
          {row.id}
        </Link>
      ),
    },
    {
      field: 'username',
      headerName: t('admin.columns.username'),
      minWidth: 180,
      flex: 1,
      renderCell: ({ row }) => (
        <UserPopover username={row.username}>
          <Typography color="primary" fontWeight={600} variant="body2" noWrap>
            {row.username}
          </Typography>
        </UserPopover>
      ),
    },
    { field: 'email', headerName: t('admin.columns.email'), minWidth: 220, flex: 1 },
    {
      field: 'skillsRating',
      headerName: t('admin.columns.skillsRating'),
      width: 130,
      renderCell: ({ row }) => renderRating(row.skillsRating),
    },
    {
      field: 'activityRating',
      headerName: t('admin.columns.activityRating'),
      width: 140,
      renderCell: ({ row }) => renderRating(row.activityRating),
    },
    { field: 'kepcoin', headerName: t('admin.columns.kepcoin'), width: 120 },
    { field: 'streak', headerName: t('admin.columns.streak'), width: 110 },
    {
      field: 'isSuperuser',
      headerName: t('admin.columns.superuser'),
      width: 130,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          label={row.isSuperuser ? t('admin.status.yes') : t('admin.status.no')}
          color={row.isSuperuser ? 'warning' : 'default'}
        />
      ),
    },
    {
      field: 'isActive',
      headerName: t('admin.columns.active'),
      width: 110,
      renderCell: ({ row }) => (
        <Checkbox
          checked={row.isActive}
          onChange={(event) => handleActiveChange(row, event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          slotProps={{ input: { 'aria-label': t('admin.columns.active') } }}
        />
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
              to: getResourceById(resources.AdminUserEdit, row.id),
            },
            {
              label: t('admin.actions.changePassword'),
              icon: 'mdi:form-textbox-password',
              onClick: () => openPasswordDialog(row),
            },
            row.isActive
              ? {
                  label: t('admin.actions.disable'),
                  icon: 'mdi:account-off-outline',
                  onClick: () => handleActiveChange(row, false),
                }
              : {
                  label: t('admin.actions.enable'),
                  icon: 'mdi:account-check-outline',
                  onClick: () => handleActiveChange(row, true),
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
        label={t('admin.form.fields.active')}
        value={activeFilter}
        onChange={(value) => setActiveFilter(String(value))}
        options={[
          { value: 'true', label: t('admin.status.yes') },
          { value: 'false', label: t('admin.status.no') },
        ]}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.staff')}
        value={staffFilter}
        onChange={(value) => setStaffFilter(String(value))}
        options={[
          { value: 'true', label: t('admin.status.yes') },
          { value: 'false', label: t('admin.status.no') },
        ]}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.superuser')}
        value={superuserFilter}
        onChange={(value) => setSuperuserFilter(String(value))}
        options={[
          { value: 'true', label: t('admin.status.yes') },
          { value: 'false', label: t('admin.status.no') },
        ]}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
      <AdminChoiceSelect
        label={t('admin.form.fields.canCreateProblems')}
        value={canCreateProblemsFilter}
        onChange={(value) => setCanCreateProblemsFilter(String(value))}
        options={[
          { value: 'true', label: t('admin.status.yes') },
          { value: 'false', label: t('admin.status.no') },
        ]}
        nullable
        emptyLabel={t('admin.filters.all')}
        fullWidth
      />
    </Stack>
  );

  return (
    <>
      {confirmationDialog}
      {
        <AdminListPageLayout
          title={t('admin.users.title')}
          createPath={resources.AdminUserCreate}
          createLabel={t('admin.users.createButton')}
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('admin.users.searchPlaceholder')}
          filterDrawerOpen={filterDrawer.open}
          filterAnchorEl={filterDrawer.anchorEl}
          filterDrawerWidth={DEFAULT_FILTER_DRAWER_WIDTH}
          filterDrawer={
            <FilterDrawer
              id="admin-users-filters-drawer"
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
              id="admin-users"
              search={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder={t('admin.users.searchPlaceholder')}
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
            selectedLabel={t('admin.selectedUsers')}
            disabled={isBatching}
            onClear={resetRowSelection}
            actions={[
              {
                label: t('admin.actions.updateRatings'),
                icon: 'mdi:chart-line',
                onClick: () => handleBatchAction('updateRatings'),
              },
              {
                label: t('admin.actions.disable'),
                icon: 'mdi:account-off-outline',
                color: 'warning',
                onClick: () => handleBatchAction('disable'),
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
            localeText={{ noRowsLabel: t('common.dataGrid.noRows.adminUsers') }}
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
          <Dialog
            aria-labelledby="admin-password-title"
            open={Boolean(passwordDialogUser)}
            onClose={closePasswordDialog}
            fullWidth
            maxWidth="xs"
          >
            <DialogHeader
              id="admin-password-title"
              title={t('admin.users.changePasswordTitle', {
                username: passwordDialogUser?.username ?? '',
              })}
              onClose={closePasswordDialog}
              closeDisabled={isChangingPassword}
            />
            <DialogContent>
              <TextField
                fullWidth
                autoFocus
                type="password"
                label={t('admin.users.newPassword')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={closePasswordDialog} disabled={isChangingPassword}>
                {t('admin.actions.cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={isChangingPassword || !password.trim()}
              >
                {t('admin.actions.save')}
              </Button>
            </DialogActions>
          </Dialog>
        </AdminListPageLayout>
      }
    </>
  );
};

export default AdminUsersListPage;
