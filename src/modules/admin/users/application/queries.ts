import useSWR from 'swr';
import { AdminListParams } from 'modules/admin/shared/helpers/types';
import { usersAdminClient } from '../data-access/usersAdminClient';
import { AdminUser } from '../domain/types';

export const useAdminUsers = (params: AdminListParams) =>
  useSWR(['admin-users', params], () => usersAdminClient.list(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useAdminUser = (id?: string | number | null) =>
  useSWR<AdminUser>(id ? ['admin-user', id] : null, () => usersAdminClient.read(id!), {
    revalidateOnFocus: false,
  });
