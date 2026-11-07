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

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await axiosFetcher(apiEndpoints.profile);
      return response ? mapAuthUserFromApi(response as AuthUser) : null;
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status === 401 || status === 403) return null;
      throw error;
    }
  }
}

export const authenticationRepository = new AuthenticationRepositoryImpl();
