import useSWR, { type SWRConfiguration } from 'swr';
import { authenticationRepository } from '../data-access';
import type { AuthUser } from '../domain';
import { authKeys } from './keys';

export const useCurrentUser = (config?: SWRConfiguration<AuthUser | null>) =>
  useSWR<AuthUser | null>(authKeys.detail('current-user'), () => authenticationRepository.getCurrentUser(), {
    suspense: true,
    shouldRetryOnError: false,
    ...config,
  });
