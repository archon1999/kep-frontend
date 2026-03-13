import { apiEndpoints } from 'app/routes/route-config';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import type { AuthUser, LoginPayload } from '../../domain/entities/auth.entity';


export const authApiClient = {
  login: ({ username, password }: LoginPayload) => {
    const token = btoa(`${username}:${password}`);

    return axiosFetcher([
      apiEndpoints.login,
      {
        method: 'post',
        headers: {
          Authorization: `Basic ${token}`,
        },
      },
    ]) as Promise<AuthUser>;
  },
  logout: () => axiosFetcher([apiEndpoints.logout, { method: 'post' }]) as Promise<void>,
  currentUser: () =>
    axiosFetcher([
      apiEndpoints.profile,
      {},
      { disableThrowError: true },
    ]) as Promise<AuthUser | null>,
};
