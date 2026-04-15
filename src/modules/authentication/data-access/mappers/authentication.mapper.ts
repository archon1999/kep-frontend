import type { AuthUser } from '../../domain';

type AuthApiPayload = AuthUser & {
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
};

export const mapAuthUserFromApi = (payload: AuthApiPayload): AuthUser => ({
  ...payload,
  firstName: payload.firstName ?? payload.first_name,
  lastName: payload.lastName ?? payload.last_name,
  isSuperuser: payload.isSuperuser ?? payload.is_superuser,
});
