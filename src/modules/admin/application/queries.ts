import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { adminRepository } from 'modules/admin/data-access';
import type { AdminListQuery, AdminLookup } from 'modules/admin/domain';
import useSWR from 'swr';
import { adminKeys } from './keys';

const options = { revalidateOnFocus: false, shouldRetryOnError: false };
const useConsoleScope = () => {
  const { i18n } = useTranslation();
  const { currentUser } = useAuth();
  return `${currentUser?.id ?? currentUser?.username ?? 'anonymous'}:${currentUser?.isSuperuser ? 'super' : 'staff'}:${i18n.language}`;
};
export const useAdminRegistry = () => {
  const scope = useConsoleScope();
  return useSWR(adminKeys.registry(scope), () => adminRepository.registry(), options);
};
export const useAdminDashboard = () => {
  const scope = useConsoleScope();
  return useSWR(adminKeys.dashboard(scope), () => adminRepository.dashboard(), {
    ...options,
    refreshInterval: 60000,
  });
};
export const useAdminList = (key: string, query: AdminListQuery) => {
  const scope = useConsoleScope();
  return useSWR(
    key ? adminKeys.list(scope, key, query) : null,
    () => adminRepository.list(key, query),
    { ...options, keepPreviousData: true },
  );
};
export const useAdminDetail = (key: string, id?: string) => {
  const scope = useConsoleScope();
  return useSWR(
    key ? adminKeys.detail(scope, key, id) : null,
    () => adminRepository.detail(key, id),
    { ...options, keepPreviousData: true },
  );
};
export const useAdminHistory = (key: string, id?: string, open = true) => {
  const scope = useConsoleScope();
  return useSWR(
    id && open ? ['admin-console', scope, key, id, 'history'] : null,
    () => adminRepository.history(key, id!),
    options,
  );
};
export const useAdminWorkflow = () => {
  const scope = useConsoleScope();
  return useSWR(
    ['admin-console', scope, 'legacy-order'],
    () => adminRepository.workflow(),
    options,
  );
};
export const useAdminRelation = (key: string, query: AdminLookup, active: boolean) => {
  const scope = useConsoleScope();
  return useSWR(
    active ? ['admin-console', scope, 'lookup', key, query] : null,
    () => adminRepository.lookup(key, query),
    { ...options, keepPreviousData: true },
  );
};
