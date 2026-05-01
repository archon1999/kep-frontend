import {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTeam,
  SkillCatalogItem,
  AccountTechnology,
  AccountWorkExperience,
  ChangePasswordPayload,
} from '../entities';

export interface AccountSettingsRepository {
  getGeneralInfo(username: string): Promise<AccountGeneralInfo>;
  updateGeneralInfo(username: string, payload: AccountGeneralInfo): Promise<AccountGeneralInfo>;

  getProfileInfo(username: string): Promise<AccountProfileInfo>;
  updateProfileInfo(username: string, payload: AccountProfileInfo): Promise<AccountProfileInfo>;

  getSocial(username: string): Promise<AccountSocialLinks>;
  updateSocial(username: string, payload: AccountSocialLinks): Promise<AccountSocialLinks>;

  getSkills(username: string): Promise<AccountSkills>;
  updateSkills(username: string, payload: AccountSkills): Promise<AccountSkills>;
  getSkillCatalog(): Promise<SkillCatalogItem[]>;

  getTechnologies(username: string): Promise<AccountTechnology[]>;
  updateTechnologies(username: string, payload: AccountTechnology[]): Promise<AccountTechnology[]>;

  getEducations(username: string): Promise<AccountEducation[]>;
  updateEducations(username: string, payload: AccountEducation[]): Promise<AccountEducation[]>;

  getWorkExperiences(username: string): Promise<AccountWorkExperience[]>;
  updateWorkExperiences(username: string, payload: AccountWorkExperience[]): Promise<AccountWorkExperience[]>;

  changePassword(username: string, payload: ChangePasswordPayload): Promise<void>;

  getTeams(): Promise<AccountTeam[]>;
  createTeam(name: string): Promise<AccountTeam>;
  joinTeam(code: string): Promise<AccountTeam>;
  deleteTeam(code: string): Promise<void>;
  refreshTeamCode(code: string): Promise<AccountTeam>;
}
