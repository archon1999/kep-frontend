import { createKeyFactory } from 'shared/api';
import useSWR, { type SWRConfiguration } from 'swr';
import { HttpAuthenticationRepository } from '../data-access/repository/http.authentication.repository';
import type { AuthUser } from '../domain/entities/auth.entity';

const repository = new HttpAuthenticationRepository();
const authKeys = createKeyFactory('auth');

export const useCurrentUser = (config?: SWRConfiguration<AuthUser | null>) =>
  useSWR<AuthUser | null>(authKeys.detail('current-user'), () => repository.getCurrentUser(), {
    suspense: true,
    shouldRetryOnError: false,
    ...config,
  });
