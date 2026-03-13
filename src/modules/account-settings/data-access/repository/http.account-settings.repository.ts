import {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTeam,
  AccountTechnology,
  AccountWorkExperience,
  ChangePasswordPayload,
} from '../../domain/entities/account-settings.entity';
import { AccountSettingsRepository } from '../../domain/ports/account-settings.repository';
import { accountSettingsApiClient } from '../api/account-settings.client';

export class HttpAccountSettingsRepository implements AccountSettingsRepository {
  getGeneralInfo(username: string): Promise<AccountGeneralInfo> {
    return accountSettingsApiClient.getGeneralInfo(username);
  }

  updateGeneralInfo(username: string, payload: AccountGeneralInfo): Promise<AccountGeneralInfo> {
    return accountSettingsApiClient.updateGeneralInfo(username, payload);
  }

  getProfileInfo(username: string): Promise<AccountProfileInfo> {
    return accountSettingsApiClient.getProfileInfo(username);
  }

  updateProfileInfo(username: string, payload: AccountProfileInfo): Promise<AccountProfileInfo> {
    return accountSettingsApiClient.updateProfileInfo(username, payload);
  }

  getSocial(username: string): Promise<AccountSocialLinks> {
    return accountSettingsApiClient.getSocial(username);
  }

  updateSocial(username: string, payload: AccountSocialLinks): Promise<AccountSocialLinks> {
    return accountSettingsApiClient.updateSocial(username, payload);
  }

  getSkills(username: string): Promise<AccountSkills> {
    return accountSettingsApiClient.getSkills(username);
  }

  updateSkills(username: string, payload: AccountSkills): Promise<AccountSkills> {
    return accountSettingsApiClient.updateSkills(username, payload);
  }

  getTechnologies(username: string): Promise<AccountTechnology[]> {
    return accountSettingsApiClient.getTechnologies(username);
  }

  updateTechnologies(username: string, payload: AccountTechnology[]): Promise<AccountTechnology[]> {
    return accountSettingsApiClient.updateTechnologies(username, payload);
  }

  getEducations(username: string): Promise<AccountEducation[]> {
    return accountSettingsApiClient.getEducations(username);
  }

  updateEducations(username: string, payload: AccountEducation[]): Promise<AccountEducation[]> {
    return accountSettingsApiClient.updateEducations(username, payload);
  }

  getWorkExperiences(username: string): Promise<AccountWorkExperience[]> {
    return accountSettingsApiClient.getWorkExperiences(username);
  }

  updateWorkExperiences(
    username: string,
    payload: AccountWorkExperience[],
  ): Promise<AccountWorkExperience[]> {
    return accountSettingsApiClient.updateWorkExperiences(username, payload);
  }

  changePassword(username: string, payload: ChangePasswordPayload): Promise<void> {
    return accountSettingsApiClient.changePassword(username, payload);
  }

  getTeams(): Promise<AccountTeam[]> {
    return accountSettingsApiClient.getTeams();
  }

  createTeam(name: string): Promise<AccountTeam> {
    return accountSettingsApiClient.createTeam(name);
  }

  joinTeam(code: string): Promise<AccountTeam> {
    return accountSettingsApiClient.joinTeam(code);
  }

  refreshTeamCode(code: string): Promise<AccountTeam> {
    return accountSettingsApiClient.refreshTeamCode(code);
  }
}
