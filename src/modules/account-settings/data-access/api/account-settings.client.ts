import { instance } from 'shared/api/http/axiosInstance';
import type {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTechnology,
  AccountWorkExperience,
  ChangePasswordPayload,
} from '../../domain/entities/account-settings.entity';

export const accountSettingsApiClient = {
  getGeneralInfo: async (username: string) =>
    (await instance.get<AccountGeneralInfo>(`/api/users/${username}/general-info/`)).data,
  updateGeneralInfo: async (username: string, payload: AccountGeneralInfo) =>
    (await instance.post<AccountGeneralInfo>(`/api/users/${username}/general-info/`, payload)).data,

  getProfileInfo: async (username: string) =>
    (await instance.get<AccountProfileInfo>(`/api/users/${username}/info/`)).data,
  updateProfileInfo: async (username: string, payload: AccountProfileInfo) =>
    (await instance.post<AccountProfileInfo>(`/api/users/${username}/info/`, payload)).data,

  getSocial: async (username: string) =>
    (await instance.get<AccountSocialLinks>(`/api/users/${username}/social/`)).data,
  updateSocial: async (username: string, payload: AccountSocialLinks) =>
    (await instance.post<AccountSocialLinks>(`/api/users/${username}/social/`, payload)).data,

  getSkills: async (username: string) =>
    (await instance.get<AccountSkills>(`/api/users/${username}/skills/`)).data,
  updateSkills: async (username: string, payload: AccountSkills) =>
    (await instance.post<AccountSkills>(`/api/users/${username}/skills/`, payload)).data,

  getTechnologies: async (username: string) =>
    (await instance.get<AccountTechnology[]>(`/api/users/${username}/technologies/`)).data,
  updateTechnologies: async (username: string, payload: AccountTechnology[]) =>
    (await instance.post<AccountTechnology[]>(`/api/users/${username}/technologies/`, payload)).data,

  getEducations: async (username: string) =>
    (await instance.get<AccountEducation[]>(`/api/users/${username}/educations/`)).data,
  updateEducations: async (username: string, payload: AccountEducation[]) =>
    (await instance.post<AccountEducation[]>(`/api/users/${username}/educations/`, payload)).data,

  getWorkExperiences: async (username: string) =>
    (await instance.get<AccountWorkExperience[]>(`/api/users/${username}/work-experiences/`)).data,
  updateWorkExperiences: async (username: string, payload: AccountWorkExperience[]) =>
    (await instance.post<AccountWorkExperience[]>(`/api/users/${username}/work-experiences/`, payload)).data,

  changePassword: async (username: string, payload: ChangePasswordPayload) => {
    await instance.post(`/api/users/${username}/change-password/`, payload);
  },

  getTeams: async () => (await instance.get('/api/user-teams/')).data,
  createTeam: async (name: string) => (await instance.post('/api/user-teams/', { name })).data,
  joinTeam: async (code: string) => (await instance.post(`/api/user-teams/${code}/join/`)).data,
  refreshTeamCode: async (code: string) =>
    (await instance.post(`/api/user-teams/${code}/refresh-code/`)).data,
};
