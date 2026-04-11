import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { getResourceById, resources } from 'app/routes/resources';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import { getOrderingFromSortModel } from 'modules/admin/shared/ui/gridSorting';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminContests } from '../../application/queries';
import { contestsAdminClient } from '../../data-access/contestsAdminClient';
import { AdminContest } from '../../domain/types';

const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString() : '');

const AdminContestsListPage = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'start_time', sort: 'desc' }]);
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

  const { data, isLoading, isValidating, mutate } = useAdminContests(queryParams);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const handleDelete = async (contest: AdminContest) => {
    if (!window.confirm(`Delete contest #${contest.id}?`)) {
      return;
    }

    await contestsAdminClient.remove(contest.id);
    await mutate();
  };

  const columns: GridColDef<AdminContest>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', minWidth: 260, flex: 1 },
    { field: 'type', headerName: 'Type', width: 130 },
    {
      field: 'start_time',
      headerName: 'Start',
      width: 190,
      renderCell: ({ row }) => formatDateTime(row.start_time),
    },
    {
      field: 'finish_time',
      headerName: 'Finish',
      width: 190,
      renderCell: ({ row }) => formatDateTime(row.finish_time),
    },
    {
      field: 'private',
      headerName: 'Private',
      width: 120,
      renderCell: ({ row }) => (
        <Chip size="small" label={row.private ? 'Yes' : 'No'} color={row.private ? 'warning' : 'success'} />
      ),
    },
    { field: 'creator_username', headerName: 'Creator', width: 160, sortable: false },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <AdminRowActions
          editPath={getResourceById(resources.AdminContestEdit, row.id)}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <AdminListPageLayout
      title="Contests"
      createPath={resources.AdminContestCreate}
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

export default AdminContestsListPage;
