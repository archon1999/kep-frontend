export interface AccountGeneralInfo {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | File;
  coverPhoto?: string | File;
  telegramNotificationsEnabled?: boolean;
}

export interface AccountProfileInfo {
  country?: string;
  region?: string;
  website?: string;
  email?: string;
  emailVisible?: boolean;
  dateJoined?: string;
  dateOfBirth?: string;
  bio?: string;
}

export interface AccountSocialLinks {
  telegram?: string;
  codeforcesHandle?: string;
  codeforcesBadge?: string;
}

export interface SkillLabels {
  en: string;
  ru: string;
  uz: string;
}

export interface UserSkillItem {
  id?: number;
  skillId?: number;
  slug?: string;
  name: string;
  labels?: SkillLabels | null;
  isCustom: boolean;
  level: number;
}

export interface SkillCatalogItem {
  skillId: number;
  slug: string;
  name: string;
  labels: SkillLabels;
  nameEn: string;
  nameRu: string;
  nameUz: string;
}

export type AccountSkills = UserSkillItem[];

export interface AccountTechnology {
  text: string;
  devIconClass: string;
  badgeColor: string;
}

export interface AccountEducation {
  organization: string;
  degree: string;
  fromYear: number | null;
  toYear: number | null;
}

export interface AccountWorkExperience {
  company: string;
  jobTitle: string;
  fromYear: number | null;
  toYear: number | null;
}

export interface TeamMember {
  username: string;
  avatar: string;
  status: number;
}

export interface AccountTeam {
  id: number;
  name: string;
  code: string;
  createrUsername: string;
  createrAvatar?: string;
  members: TeamMember[];
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
