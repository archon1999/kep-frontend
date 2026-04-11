import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { getResourceById, resources } from 'app/routes/resources';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import { getOrderingFromSortModel } from 'modules/admin/shared/ui/gridSorting';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminProblems } from '../../application/queries';
import { problemsAdminClient } from '../../data-access/problemsAdminClient';
import { AdminProblem } from '../../domain/types';

const AdminProblemsListPage = () => {
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

  const { data, isLoading, isValidating, mutate } = useAdminProblems(queryParams);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const handleDelete = async (problem: AdminProblem) => {
    if (!window.confirm(`Delete problem #${problem.id}?`)) {
      return;
    }

    await problemsAdminClient.remove(problem.id);
    await mutate();
  };

  const columns: GridColDef<AdminProblem>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', minWidth: 260, flex: 1 },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      width: 130,
      renderCell: ({ row }) => <Chip size="small" label={row.difficulty} variant="soft" />,
    },
    { field: 'problem_rating', headerName: 'Rating', width: 120 },
    {
      field: 'hidden',
      headerName: 'Hidden',
      width: 110,
      renderCell: ({ row }) => (
        <Chip size="small" label={row.hidden ? 'Yes' : 'No'} color={row.hidden ? 'warning' : 'success'} />
      ),
    },
    { field: 'author_username', headerName: 'Author', width: 160, sortable: false },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <AdminRowActions
          editPath={getResourceById(resources.AdminProblemEdit, row.id)}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <AdminListPageLayout
      title="Problems"
      createPath={resources.AdminProblemCreate}
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

export default AdminProblemsListPage;
