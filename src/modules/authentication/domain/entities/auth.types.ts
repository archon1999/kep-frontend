import type { UserAuth } from 'shared/api/orval/generated/endpoints/index.schemas';

export type AuthUser = UserAuth & {
  isStaff?: boolean;
  id?: number | string;
  name?: string;
  email?: string;
  avatar?: string | null;
  designation?: string;
  requiresPasswordSetup?: boolean;
};

export interface LoginPayload {
  username: string;
  password: string;
}

export interface FirstPasswordPayload {
  sub: string;
  password: string;
}
