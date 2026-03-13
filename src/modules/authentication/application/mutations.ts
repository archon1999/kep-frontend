import { createKeyFactory } from 'shared/api';
import useSWRMutation from 'swr/mutation';
import { HttpAuthenticationRepository } from '../data-access/repository/http.authentication.repository';
import type { AuthUser, LoginPayload } from '../domain/entities/auth.entity';

const repository = new HttpAuthenticationRepository();
const authKeys = createKeyFactory('auth');

export const useLoginUser = () =>
  useSWRMutation<AuthUser, Error, readonly unknown[], LoginPayload>(
    authKeys.detail('login'),
    async (_, { arg }) => repository.login(arg),
  );

export const useLogOutUser = () =>
  useSWRMutation<void, Error, readonly unknown[], void>(authKeys.detail('logout'), async () =>
    repository.logout(),
  );
