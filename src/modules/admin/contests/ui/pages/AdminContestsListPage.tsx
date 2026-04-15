import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Chip, Link, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router';
import { getResourceById, resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover';
import AdminBatchActionsToolbar from 'modules/admin/shared/ui/AdminBatchActionsToolbar';
import { AdminChoiceSelect } from 'modules/admin/shared/ui/AdminChoiceSelects';
import AdminFiltersToolbar, { AdminActiveFilter } from 'modules/admin/shared/ui/AdminFiltersToolbar';
import AdminListPageLayout from 'modules/admin/shared/ui/AdminListPageLayout';
import { AdminAutocompleteOption, UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import AdminRowActions from 'modules/admin/shared/ui/AdminRowActions';
import { getOrderingFromSortModel } from 'modules/admin/shared/ui/gridSorting';
import useGridPagination from 'shared/hooks/useGridPagination';
import { useAdminContestMeta, useAdminContests } from '../../application/queries';
import { contestsAdminClient } from '../../data-access/contestsAdminClient';
import { AdminContest } from '../../domain/types';

const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString() : '');

const AdminContestsListPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [participationTypeFilter, setParticipationTypeFilter] = useState<number | ''>('');
  const [ratedFilter, setRatedFilter] = useState('');
  const [privateFilter, setPrivateFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState<AdminAutocompleteOption | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [isBatching, setIsBatching] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'startTime', sort: 'desc' }]);
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
    typeFilter,
    categoryFilter,
    participationTypeFilter,
    ratedFilter,
    privateFilter,
    creatorFilter?.id,
    sortModel,
    setPaginationModel,
  ]);

  const queryParams = useMemo(
    () => ({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
      ordering: getOrderingFromSortModel(sortModel),
      search: debouncedSearch,
      type: typeFilter || undefined,
      category: categoryFilter || undefined,
      participationType: participationTypeFilter || undefined,
      isRated: ratedFilter ? ratedFilter === 'true' : undefined,
      private: privateFilter ? privateFilter === 'true' : undefined,
      creator: creatorFilter?.id,
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      sortModel,
      debouncedSearch,
      typeFilter,
      categoryFilter,
      participationTypeFilter,
      ratedFilter,
      privateFilter,
      creatorFilter?.id,
    ],
  );

  const { data, isLoading, isValidating, mutate } = useAdminContests(queryParams);
  const { data: meta } = useAdminContestMeta();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const selectedIds = useMemo(
    () => Array.from(rowSelectionModel.ids).map((id) => Number(id)).filter(Number.isFinite),
    [rowSelectionModel],
  );

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const handleClearFilters = () => {
    setTypeFilter('');
    setCategoryFilter('');
    setParticipationTypeFilter('');
    setRatedFilter('');
    setPrivateFilter('');
    setCreatorFilter(null);
  };

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
          meta?.categories.find((category) => category.value === categoryFilter)?.label ?? categoryFilter
        }`,
        onRemove: () => setCategoryFilter(''),
      });
    }

    if (participationTypeFilter !== '') {
      items.push({
        key: 'participation',
        label: `${t('admin.form.fields.participation')}: ${
          meta?.participationTypes.find((participationType) => participationType.value === participationTypeFilter)
            ?.label ?? participationTypeFilter
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
  }, [categoryFilter, creatorFilter, meta, participationTypeFilter, privateFilter, ratedFilter, t, typeFilter]);

  const handleDelete = async (contest: AdminContest) => {
    if (!window.confirm(t('admin.contests.confirmDelete', { id: contest.id }))) {
      return;
    }

    await contestsAdminClient.remove(contest.id);
    await mutate();
  };

  const handlePrivateChange = async (contest: AdminContest, isPrivate: boolean) => {
    await contestsAdminClient.update(contest.id, { private: isPrivate });
    await mutate();
  };

  const handleBatchAction = async (
    action: 'delete' | 'showProblems' | 'hideProblems' | 'updatePerformance',
  ) => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmKey =
      action === 'delete'
        ? 'admin.contests.confirmBatchDelete'
        : action === 'updatePerformance'
          ? 'admin.contests.confirmBatchUpdatePerformance'
          : null;

    if (confirmKey && !window.confirm(t(confirmKey, { count: selectedIds.length }))) {
      return;
    }

    setIsBatching(true);
    try {
      await contestsAdminClient.batch({ ids: selectedIds, action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };

  const handleContestAction = async (
    contest: AdminContest,
    action: 'showProblems' | 'hideProblems' | 'updatePerformance',
  ) => {
    if (
      action === 'updatePerformance' &&
      !window.confirm(t('admin.contests.confirmUpdatePerformance', { id: contest.id }))
    ) {
      return;
    }

    await contestsAdminClient.batch({ ids: [contest.id], action });
    await mutate();
  };

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
      renderCell: ({ row }) => formatDateTime(row.startTime),
    },
    {
      field: 'finishTime',
      headerName: t('admin.columns.finish'),
      width: 190,
      renderCell: ({ row }) => formatDateTime(row.finishTime),
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

  return (
    <AdminListPageLayout
      title={t('admin.contests.title')}
      createPath={resources.AdminContestCreate}
      search={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('admin.contests.searchPlaceholder')}
      toolbar={
        <AdminFiltersToolbar
          id="admin-contests"
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('admin.contests.searchPlaceholder')}
          activeFilters={activeFilters}
          onClearFilters={handleClearFilters}
          filters={
            <Stack direction="column" spacing={2.5}>
              <AdminChoiceSelect
                size="small"
                variant="filled"
                label={t('admin.form.fields.type')}
                value={typeFilter}
                onChange={(value) => setTypeFilter(String(value))}
                options={meta?.types ?? []}
                nullable
                emptyLabel={t('admin.filters.all')}
                fullWidth
              />
              <AdminChoiceSelect
                size="small"
                variant="filled"
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
                size="small"
                variant="filled"
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
                size="small"
                variant="filled"
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
                size="small"
                variant="filled"
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
                placeholder={t('admin.form.placeholders.username')}
                textFieldProps={{ size: 'small', variant: 'filled' }}
              />
            </Stack>
          }
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
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        disableRowSelectionExcludeModel
        disableRowSelectionOnClick
      />
    </AdminListPageLayout>
  );
};

export default AdminContestsListPage;
