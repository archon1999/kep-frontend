import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router';
import AdminDataGridSkeletonLoadingOverlay from 'modules/admin/shared/ui/AdminDataGridSkeletonLoadingOverlay';
import { getResourceById, resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import { AdminChoiceSelect } from 'modules/admin/shared/ui/AdminChoiceSelects';
import AdminFiltersToolbar, { AdminActiveFilter } from 'modules/admin/shared/ui/AdminFiltersToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { getOrderingFromSortModel } from 'modules/admin/shared/utils/gridSorting';
import FilterDrawer, {
  DEFAULT_FILTER_DRAWER_WIDTH,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminUsers } from 'modules/admin/users/application/queries';
import { usersAdminClient } from 'modules/admin/users/data-access/usersAdminClient';
import { AdminUser } from 'modules/admin/users/domain/types';

const AdminUsersListPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [superuserFilter, setSuperuserFilter] = useState('');
  const [canCreateProblemsFilter, setCanCreateProblemsFilter] = useState('');
  const filterDrawer = useFilterDrawer();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [isBatching, setIsBatching] = useState(false);
  const [passwordDialogUser, setPasswordDialogUser] = useState<AdminUser | null>(null);
  const [password, setPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);
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
    activeFilter,
    staffFilter,
    superuserFilter,
    canCreateProblemsFilter,
    sortModel,
    setPaginationModel,
  ]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel),
      search: debouncedSearch,
      isActive: activeFilter ? activeFilter === 'true' : undefined,
      isStaff: staffFilter ? staffFilter === 'true' : undefined,
      isSuperuser: superuserFilter ? superuserFilter === 'true' : undefined,
      canCreateProblems: canCreateProblemsFilter ? canCreateProblemsFilter === 'true' : undefined,
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      sortModel,
      debouncedSearch,
      activeFilter,
      staffFilter,
      superuserFilter,
      canCreateProblemsFilter,
    ],
  );

  const { data, isLoading, isValidating, mutate } = useAdminUsers(queryParams);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const selectedIds = useMemo(
    () => Array.from(rowSelectionModel.ids).map((id) => Number(id)).filter(Number.isFinite),
    [rowSelectionModel],
  );

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const handleClearFilters = () => {
    setActiveFilter('');
    setStaffFilter('');
    setSuperuserFilter('');
    setCanCreateProblemsFilter('');
  };

  const activeFilters = useMemo<AdminActiveFilter[]>(() => {
    const items: AdminActiveFilter[] = [];
    const booleanLabel = (value: string) => (value === 'true' ? t('admin.status.yes') : t('admin.status.no'));

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

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(t('admin.users.confirmDelete', { username: user.username }))) {
      return;
    }

    await usersAdminClient.remove(user.id);
    await mutate();
  };

  const handleActiveChange = async (user: AdminUser, isActive: boolean) => {
    await usersAdminClient.update(user.id, { isActive: isActive });
    await mutate();
  };

  const openPasswordDialog = (user: AdminUser) => {
    setPasswordDialogUser(user);
    setPassword('');
  };

  const closePasswordDialog = () => {
    if (isChangingPassword) {
      return;
    }
    setPasswordDialogUser(null);
    setPassword('');
  };

  const handleChangePassword = async () => {
    if (!passwordDialogUser || !password.trim()) {
      return;
    }

    setIsChangingPassword(true);
    try {
      await usersAdminClient.changePassword(passwordDialogUser.id, { password });
      closePasswordDialog();
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleBatchAction = async (action: 'delete' | 'disable' | 'updateRatings') => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmKey =
      action === 'delete'
        ? 'admin.users.confirmBatchDelete'
        : action === 'disable'
          ? 'admin.users.confirmBatchDisable'
          : 'admin.users.confirmBatchUpdateRatings';

    if (!window.confirm(t(confirmKey, { count: selectedIds.length }))) {
      return;
    }

    setIsBatching(true);
    try {
      await usersAdminClient.batch({ ids: selectedIds, action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };

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
    <AdminListPageLayout
      title={t('admin.users.title')}
      createPath={resources.AdminUserCreate}
      createLabel={t('admin.users.createButton')}
      search={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('admin.users.searchPlaceholder')}
      filterDrawerOpen={filterDrawer.open}
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
      <Dialog open={Boolean(passwordDialogUser)} onClose={closePasswordDialog} fullWidth maxWidth="xs">
        <DialogTitle>
          {t('admin.users.changePasswordTitle', { username: passwordDialogUser?.username ?? '' })}
        </DialogTitle>
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
  );
};

export default AdminUsersListPage;
