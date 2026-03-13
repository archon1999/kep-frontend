import type { AuthUser, LoginPayload } from '../../domain/entities/auth.entity';
import type { AuthenticationRepository } from '../../domain/ports/authentication.repository';
import { authApiClient } from '../api/auth.client';

export class HttpAuthenticationRepository implements AuthenticationRepository {
  login(payload: LoginPayload): Promise<AuthUser> {
    return authApiClient.login(payload);
  }

  logout(): Promise<void> {
    return authApiClient.logout();
  }

  getCurrentUser(): Promise<AuthUser | null> {
    return authApiClient.currentUser();
  }
}
