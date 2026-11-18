import useSWRMutation from 'swr/mutation';
import { authenticationRepository } from '../data-access';
import type { AuthUser, FirstPasswordPayload, LoginPayload } from '../domain';
import { authKeys } from './keys';

export const useLoginUser = () =>
  useSWRMutation<AuthUser, Error, readonly unknown[], LoginPayload>(
    authKeys.detail('login'),
    async (_, { arg }) => authenticationRepository.login(arg),
  );

export const useLogOutUser = () =>
  useSWRMutation<void, Error, readonly unknown[], void>(authKeys.detail('logout'), async () =>
    authenticationRepository.logout(),
  );

export const useSetFirstPassword = () =>
  useSWRMutation<AuthUser, unknown, readonly unknown[], FirstPasswordPayload>(
    authKeys.detail('first-password'),
    (_, { arg }) => authenticationRepository.setFirstPassword(arg),
  );
