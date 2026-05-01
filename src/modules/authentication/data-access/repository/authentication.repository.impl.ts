import { apiEndpoints } from 'app/routes/route-config';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import type { AuthUser, AuthenticationRepository, LoginPayload } from '../../domain';
import { mapAuthUserFromApi } from '../mappers';

const createBasicAuthHeader = ({ username, password }: LoginPayload) => {
  const token = btoa(`${username}:${password}`);

  return `Basic ${token}`;
};

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  login(payload: LoginPayload): Promise<AuthUser> {
    return axiosFetcher([
      apiEndpoints.login,
      {
        method: 'post',
        headers: {
          Authorization: createBasicAuthHeader(payload),
        },
      },
    ]).then(mapAuthUserFromApi) as Promise<AuthUser>;
  }

  logout(): Promise<void> {
    return axiosFetcher([apiEndpoints.logout, { method: 'post' }]) as Promise<void>;
  }

  getCurrentUser(): Promise<AuthUser | null> {
    return axiosFetcher([
      apiEndpoints.profile,
      {},
      { disableThrowError: true },
    ]).then((response) => (response ? mapAuthUserFromApi(response as AuthUser) : null)) as Promise<
      AuthUser | null
    >;
  }
}

export const authenticationRepository = new AuthenticationRepositoryImpl();
