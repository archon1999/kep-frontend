import useSWR from 'swr';
import { AdminListParams } from 'modules/admin/shared/helpers/types';
import { contestsAdminClient } from '../data-access/contestsAdminClient';
import { AdminContest, AdminContestMeta } from '../domain/types';

export const useAdminContests = (params: AdminListParams) =>
  useSWR(['admin-contests', params], () => contestsAdminClient.list(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useAdminContest = (id?: string | number | null) =>
  useSWR<AdminContest>(id ? ['admin-contest', id] : null, () => contestsAdminClient.read(id!), {
    revalidateOnFocus: false,
  });

export const useAdminContestMeta = () =>
  useSWR<AdminContestMeta>(['admin-contest-meta'], () => contestsAdminClient.meta(), {
    revalidateOnFocus: false,
  });
