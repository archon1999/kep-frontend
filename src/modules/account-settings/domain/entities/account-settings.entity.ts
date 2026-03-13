export interface AccountGeneralInfo {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  coverPhoto?: string;
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

export interface AccountSkills {
  python?: number;
  webDevelopment?: number;
  webScraping?: number;
  algorithms?: number;
  dataScience?: number;
}

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
