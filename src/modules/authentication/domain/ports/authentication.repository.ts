import type { AuthUser, LoginPayload } from '../entities/auth.entity';

export interface AuthenticationRepository {
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
}
