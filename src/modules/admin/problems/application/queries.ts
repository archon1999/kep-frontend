import useSWR from 'swr';
import { AdminListParams } from 'modules/admin/shared/domain/types';
import { problemsAdminClient } from '../data-access/problemsAdminClient';
import { AdminProblem, AdminProblemMeta } from '../domain/types';

export const useAdminProblems = (params: AdminListParams) =>
  useSWR(['admin-problems', params], () => problemsAdminClient.list(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useAdminProblem = (id?: string | number | null) =>
  useSWR<AdminProblem>(id ? ['admin-problem', id] : null, () => problemsAdminClient.read(id!), {
    revalidateOnFocus: false,
  });

export const useAdminProblemMeta = () =>
  useSWR<AdminProblemMeta>(['admin-problem-meta'], () => problemsAdminClient.meta(), {
    revalidateOnFocus: false,
  });
