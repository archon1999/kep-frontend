import {
  type AccountEducation,
  type AccountGeneralInfo,
  type AccountProfileInfo,
  type AccountSettingsRepository,
  type AccountSkills,
  type AccountSocialLinks,
  type AccountTeam,
  type AccountTechnology,
  type AccountWorkExperience,
  type ChangePasswordPayload,
  type SkillCatalogItem,
} from '../../domain';
import { instance } from 'shared/api/http/axiosInstance';
import {
  mapAccountEducationListFromApi,
  mapAccountEducationListToApi,
  mapAccountGeneralInfoFromApi,
  mapAccountGeneralInfoToApiFormData,
  mapAccountProfileInfoFromApi,
  mapAccountProfileInfoToApi,
  mapAccountSkillCatalogFromApi,
  mapAccountSkillsFromApi,
  mapAccountSkillsToApi,
  mapAccountSocialLinksFromApi,
  mapAccountSocialLinksToApi,
  mapAccountTeamFromApi,
  mapAccountTeamsFromApi,
  mapAccountTechnologyListFromApi,
  mapAccountTechnologyListToApi,
  mapAccountWorkExperienceListFromApi,
  mapAccountWorkExperienceListToApi,
  mapChangePasswordPayloadToApi,
} from '../mappers';

export class AccountSettingsRepositoryImpl implements AccountSettingsRepository {
  async getGeneralInfo(username: string): Promise<AccountGeneralInfo> {
    const { data } = await instance.get<AccountGeneralInfo>(`/api/users/${username}/general-info/`);
    return mapAccountGeneralInfoFromApi(data);
  }

  async updateGeneralInfo(
    username: string,
    payload: AccountGeneralInfo,
  ): Promise<AccountGeneralInfo> {
    const { data } = await instance.post<AccountGeneralInfo>(
      `/api/users/${username}/general-info/`,
      mapAccountGeneralInfoToApiFormData(payload),
      { timeout: 30000 },
    );

    return mapAccountGeneralInfoFromApi(data);
  }

  async getProfileInfo(username: string): Promise<AccountProfileInfo> {
    const { data } = await instance.get<AccountProfileInfo>(`/api/users/${username}/info/`);
    return mapAccountProfileInfoFromApi(data);
  }

  async updateProfileInfo(
    username: string,
    payload: AccountProfileInfo,
  ): Promise<AccountProfileInfo> {
    const { data } = await instance.post<AccountProfileInfo>(
      `/api/users/${username}/info/`,
      mapAccountProfileInfoToApi(payload),
    );

    return mapAccountProfileInfoFromApi(data);
  }

  async getSocial(username: string): Promise<AccountSocialLinks> {
    const { data } = await instance.get<AccountSocialLinks>(`/api/users/${username}/social/`);
    return mapAccountSocialLinksFromApi(data);
  }

  async updateSocial(username: string, payload: AccountSocialLinks): Promise<AccountSocialLinks> {
    const { data } = await instance.post<AccountSocialLinks>(
      `/api/users/${username}/social/`,
      mapAccountSocialLinksToApi(payload),
    );

    return mapAccountSocialLinksFromApi(data);
  }

  async getSkills(username: string): Promise<AccountSkills> {
    const { data } = await instance.get<AccountSkills>(`/api/users/${username}/skills/`);
    return mapAccountSkillsFromApi(data);
  }

  async updateSkills(username: string, payload: AccountSkills): Promise<AccountSkills> {
    const { data } = await instance.post<AccountSkills>(
      `/api/users/${username}/skills/`,
      mapAccountSkillsToApi(payload),
    );

    return mapAccountSkillsFromApi(data);
  }

  async getSkillCatalog(): Promise<SkillCatalogItem[]> {
    const { data } = await instance.get<SkillCatalogItem[]>(`/api/skills/catalog/`);
    return mapAccountSkillCatalogFromApi(data);
  }

  async getTechnologies(username: string): Promise<AccountTechnology[]> {
    const { data } = await instance.get<AccountTechnology[]>(`/api/users/${username}/technologies/`);
    return mapAccountTechnologyListFromApi(data);
  }

  async updateTechnologies(
    username: string,
    payload: AccountTechnology[],
  ): Promise<AccountTechnology[]> {
    const { data } = await instance.post<AccountTechnology[]>(
      `/api/users/${username}/technologies/`,
      mapAccountTechnologyListToApi(payload),
    );

    return mapAccountTechnologyListFromApi(data);
  }

  async getEducations(username: string): Promise<AccountEducation[]> {
    const { data } = await instance.get<AccountEducation[]>(`/api/users/${username}/educations/`);
    return mapAccountEducationListFromApi(data);
  }

  async updateEducations(
    username: string,
    payload: AccountEducation[],
  ): Promise<AccountEducation[]> {
    const { data } = await instance.post<AccountEducation[]>(
      `/api/users/${username}/educations/`,
      mapAccountEducationListToApi(payload),
    );

    return mapAccountEducationListFromApi(data);
  }

  async getWorkExperiences(username: string): Promise<AccountWorkExperience[]> {
    const { data } = await instance.get<AccountWorkExperience[]>(
      `/api/users/${username}/work-experiences/`,
    );

    return mapAccountWorkExperienceListFromApi(data);
  }

  async updateWorkExperiences(
    username: string,
    payload: AccountWorkExperience[],
  ): Promise<AccountWorkExperience[]> {
    const { data } = await instance.post<AccountWorkExperience[]>(
      `/api/users/${username}/work-experiences/`,
      mapAccountWorkExperienceListToApi(payload),
    );

    return mapAccountWorkExperienceListFromApi(data);
  }

  async changePassword(username: string, payload: ChangePasswordPayload): Promise<void> {
    await instance.post(
      `/api/users/${username}/change-password/`,
      mapChangePasswordPayloadToApi(payload),
    );
  }

  async getTeams(): Promise<AccountTeam[]> {
    const { data } = await instance.get<AccountTeam[]>('/api/user-teams/');
    return mapAccountTeamsFromApi(data);
  }

  async createTeam(name: string): Promise<AccountTeam> {
    const { data } = await instance.post<AccountTeam>('/api/user-teams/', { name });
    return mapAccountTeamFromApi(data);
  }

  async joinTeam(code: string): Promise<AccountTeam> {
    const { data } = await instance.post<AccountTeam>(`/api/user-teams/${code}/join/`);
    return mapAccountTeamFromApi(data);
  }

  async refreshTeamCode(code: string): Promise<AccountTeam> {
    const { data } = await instance.post<AccountTeam>(`/api/user-teams/${code}/refresh-code/`);
    return mapAccountTeamFromApi(data);
  }
}

export const accountSettingsRepository = new AccountSettingsRepositoryImpl();
