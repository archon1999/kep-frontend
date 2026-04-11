export interface AdminUser {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  kepcoin: number;
  streak: number;
  max_streak: number;
  last_seen?: string;
  can_create_problems: boolean;
  can_change_problem_similar: boolean;
  can_change_problem_tags: boolean;
  can_use_check_samples: boolean;
}

export type AdminUserPayload = Omit<AdminUser, 'id' | 'last_seen'> & {
  id?: number;
  last_seen?: string;
  password?: string;
};
