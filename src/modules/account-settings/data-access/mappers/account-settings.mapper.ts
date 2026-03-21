import type {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTeam,
  AccountTechnology,
  AccountWorkExperience,
  ChangePasswordPayload,
  SkillCatalogItem,
  SkillLabels,
  TeamMember,
  UserSkillItem,
} from '../../domain';

const cloneSkillLabels = (labels?: SkillLabels | null): SkillLabels | null | undefined =>
  labels ? { ...labels } : labels;

const cloneUserSkillItem = (item: UserSkillItem): UserSkillItem => ({
  ...item,
  labels: cloneSkillLabels(item.labels),
});

const cloneSkillCatalogItem = (item: SkillCatalogItem): SkillCatalogItem => ({
  ...item,
  labels: { ...item.labels },
});

const cloneTeamMember = (item: TeamMember): TeamMember => ({ ...item });

export const mapAccountGeneralInfoFromApi = (payload: AccountGeneralInfo): AccountGeneralInfo => ({
  ...payload,
});

export const mapAccountGeneralInfoToApiFormData = (payload: AccountGeneralInfo): FormData => {
  const formData = new FormData();

  formData.append('username', payload.username);

  if (payload.firstName !== undefined) formData.append('first_name', payload.firstName);
  if (payload.lastName !== undefined) formData.append('last_name', payload.lastName);
  if (payload.email !== undefined) formData.append('email', payload.email);
  if (payload.avatar instanceof File) formData.append('avatar', payload.avatar);
  if (payload.coverPhoto instanceof File) formData.append('cover_photo', payload.coverPhoto);

  return formData;
};

export const mapAccountProfileInfoFromApi = (payload: AccountProfileInfo): AccountProfileInfo => ({
  ...payload,
});

export const mapAccountProfileInfoToApi = (payload: AccountProfileInfo): AccountProfileInfo => ({
  ...payload,
});

export const mapAccountSocialLinksFromApi = (
  payload: AccountSocialLinks,
): AccountSocialLinks => ({ ...payload });

export const mapAccountSocialLinksToApi = (payload: AccountSocialLinks): AccountSocialLinks => ({
  ...payload,
});

export const mapAccountSkillsFromApi = (payload: AccountSkills): AccountSkills =>
  payload.map(cloneUserSkillItem);

export const mapAccountSkillsToApi = (payload: AccountSkills): AccountSkills =>
  payload.map(cloneUserSkillItem);

export const mapAccountSkillCatalogFromApi = (
  payload: SkillCatalogItem[],
): SkillCatalogItem[] => payload.map(cloneSkillCatalogItem);

export const mapAccountTechnologyListFromApi = (
  payload: AccountTechnology[],
): AccountTechnology[] => payload.map((item) => ({ ...item }));

export const mapAccountTechnologyListToApi = (
  payload: AccountTechnology[],
): AccountTechnology[] => payload.map((item) => ({ ...item }));

export const mapAccountEducationListFromApi = (
  payload: AccountEducation[],
): AccountEducation[] => payload.map((item) => ({ ...item }));

export const mapAccountEducationListToApi = (
  payload: AccountEducation[],
): AccountEducation[] => payload.map((item) => ({ ...item }));

export const mapAccountWorkExperienceListFromApi = (
  payload: AccountWorkExperience[],
): AccountWorkExperience[] => payload.map((item) => ({ ...item }));

export const mapAccountWorkExperienceListToApi = (
  payload: AccountWorkExperience[],
): AccountWorkExperience[] => payload.map((item) => ({ ...item }));

export const mapAccountTeamFromApi = (payload: AccountTeam): AccountTeam => ({
  ...payload,
  members: payload.members?.map(cloneTeamMember) ?? [],
});

export const mapAccountTeamsFromApi = (payload: AccountTeam[]): AccountTeam[] =>
  payload.map(mapAccountTeamFromApi);

export const mapChangePasswordPayloadToApi = (
  payload: ChangePasswordPayload,
): ChangePasswordPayload => ({ ...payload });
