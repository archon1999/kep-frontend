export interface AdminUser {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  skillsRating: number | string;
  activityRating: number | string;
  kepcoin: number;
  streak: number;
  maxStreak: number;
  lastSeen?: string;
  canCreateProblems: boolean;
  canChangeProblemSimilar: boolean;
  canChangeProblemTags: boolean;
  canUseCheckSamples: boolean;
}

export type AdminUserPayload = Omit<AdminUser, 'id' | 'lastSeen'> & {
  id?: number;
  lastSeen?: string;
  password?: string;
};
