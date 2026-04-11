import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { getResourceById, resources } from 'app/routes/resources';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import { getOrderingFromSortModel } from 'modules/admin/shared/ui/gridSorting';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminUsers } from '../../application/queries';
import { usersAdminClient } from '../../data-access/usersAdminClient';
import { AdminUser } from '../../domain/types';

const AdminUsersListPage = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
  }, [debouncedSearch, setPaginationModel]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel),
      search: debouncedSearch,
    }),
    [pageParams.page, pageParams.pageSize, sortModel, debouncedSearch],
  );

  const { data, isLoading, isValidating, mutate } = useAdminUsers(queryParams);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Delete user ${user.username}?`)) {
      return;
    }

    await usersAdminClient.remove(user.id);
    await mutate();
  };

  const columns: GridColDef<AdminUser>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', minWidth: 180, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 220, flex: 1 },
    { field: 'kepcoin', headerName: 'Kepcoin', width: 120 },
    { field: 'streak', headerName: 'Streak', width: 110 },
    {
      field: 'is_superuser',
      headerName: 'Superuser',
      width: 130,
      renderCell: ({ row }) => (
        <Chip size="small" label={row.is_superuser ? 'Yes' : 'No'} color={row.is_superuser ? 'warning' : 'default'} />
      ),
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 110,
      renderCell: ({ row }) => (
        <Chip size="small" label={row.is_active ? 'Yes' : 'No'} color={row.is_active ? 'success' : 'error'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <AdminRowActions
          editPath={getResourceById(resources.AdminUserEdit, row.id)}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <AdminListPageLayout
      title="Users"
      createPath={resources.AdminUserCreate}
      search={search}
      onSearchChange={handleSearchChange}
    >
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
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        sortingMode="server"
        disableRowSelectionOnClick
      />
    </AdminListPageLayout>
  );
};

export default AdminUsersListPage;
