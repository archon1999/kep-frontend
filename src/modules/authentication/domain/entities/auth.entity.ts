import type { UserAuth } from 'shared/api/orval/generated/endpoints/index.schemas';

export type AuthUser = UserAuth & {
  id?: number | string;
  name?: string;
  email?: string;
  avatar?: string | null;
  designation?: string;
};

export interface LoginPayload {
  username: string;
  password: string;
}
