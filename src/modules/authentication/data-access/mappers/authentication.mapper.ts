import type { AuthUser } from '../../domain';

export const mapAuthUserFromApi = (payload: AuthUser): AuthUser => ({
  ...payload,
});
