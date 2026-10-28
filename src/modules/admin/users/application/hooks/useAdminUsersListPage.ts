import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOrderingFromSortModel } from 'modules/admin/shared/utils/gridSorting';
import {
  batchAdminUser,
  changePasswordAdminUser,
  removeAdminUser,
  updateAdminUser,
} from 'modules/admin/users/application/mutations';
import { useAdminUsers } from 'modules/admin/users/application/queries';
import { AdminUser } from 'modules/admin/users/domain/types';
import useGridPagination from 'shared/hooks/useGridPagination';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import type { RowSelection as GridRowSelectionModel } from 'shared/lib/grid-state';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';

export const useAdminUsersListPage = (confirm: (message: string) => Promise<boolean>) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');

  const [activeFilter, setActiveFilter] = useState('');

  const [staffFilter, setStaffFilter] = useState('');

  const [superuserFilter, setSuperuserFilter] = useState('');

  const [canCreateProblemsFilter, setCanCreateProblemsFilter] = useState('');

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
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [
    search,
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
      search,
      isActive: activeFilter ? activeFilter === 'true' : undefined,
      isStaff: staffFilter ? staffFilter === 'true' : undefined,
      isSuperuser: superuserFilter ? superuserFilter === 'true' : undefined,
      canCreateProblems: canCreateProblemsFilter ? canCreateProblemsFilter === 'true' : undefined,
    }),
    [
      pageParams.page,
      pageParams.pageSize,
      sortModel,
      search,
      activeFilter,
      staffFilter,
      superuserFilter,
      canCreateProblemsFilter,
    ],
  );

  const { data, isLoading, isValidating, mutate } = useAdminUsers(queryParams);

  const isGridLoading = isLoading || (isValidating && !data?.data);

  const rowCount = useStableGridRowCount(data?.total, isGridLoading);

  const handleSearchChange = (value: string) => setSearch(value);

  const selectedIds = useMemo(
    () =>
      Array.from(rowSelectionModel.ids)
        .map((id) => Number(id))
        .filter(Number.isFinite),
    [rowSelectionModel],
  );

  const resetRowSelection = () => setRowSelectionModel({ type: 'include', ids: new Set() });

  const handleClearFilters = () => {
    setActiveFilter('');
    setStaffFilter('');
    setSuperuserFilter('');
    setCanCreateProblemsFilter('');
  };

  const handleDelete = async (user: AdminUser) => {
    if (!(await confirm(t('admin.users.confirmDelete', { username: user.username })))) {
      return;
    }

    await removeAdminUser(user.id);
    await mutate();
  };

  const handleActiveChange = async (user: AdminUser, isActive: boolean) => {
    await updateAdminUser(user.id, { isActive: isActive });
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
      await changePasswordAdminUser(passwordDialogUser.id, { password });
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

    if (!(await confirm(t(confirmKey, { count: selectedIds.length })))) {
      return;
    }

    setIsBatching(true);
    try {
      await batchAdminUser({ ids: selectedIds, action });
      resetRowSelection();
      await mutate();
    } finally {
      setIsBatching(false);
    }
  };
  return {
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
  };
};
