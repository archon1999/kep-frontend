import useSWR from 'swr';
import type {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTeam,
  SkillCatalogItem,
  AccountTechnology,
  AccountWorkExperience,
} from '../domain';
import { accountSettingsRepository } from '../data-access';
import { accountSettingsKeys } from './keys';

export const useAccountGeneralInfo = (username?: string | null) =>
  useSWR<AccountGeneralInfo>(
    username ? accountSettingsKeys.detail(`general-info-${username}`) : null,
    () => accountSettingsRepository.getGeneralInfo(username!),
    { revalidateOnFocus: false },
  );

export const useAccountProfileInfo = (username?: string | null) =>
  useSWR<AccountProfileInfo>(
    username ? accountSettingsKeys.detail(`profile-info-${username}`) : null,
    () => accountSettingsRepository.getProfileInfo(username!),
    { revalidateOnFocus: false },
  );

export const useAccountSocial = (username?: string | null) =>
  useSWR<AccountSocialLinks>(
    username ? accountSettingsKeys.detail(`social-${username}`) : null,
    () => accountSettingsRepository.getSocial(username!),
    { revalidateOnFocus: false },
  );

export const useAccountSkills = (username?: string | null) =>
  useSWR<AccountSkills>(
    username ? accountSettingsKeys.detail(`skills-${username}`) : null,
    () => accountSettingsRepository.getSkills(username!),
    { revalidateOnFocus: false },
  );

export const useAccountSkillCatalog = () =>
  useSWR<SkillCatalogItem[]>(
    accountSettingsKeys.detail('skills-catalog'),
    () => accountSettingsRepository.getSkillCatalog(),
    {
      revalidateOnFocus: false,
    },
  );

export const useAccountTechnologies = (username?: string | null) =>
  useSWR<AccountTechnology[]>(
    username ? accountSettingsKeys.detail(`technologies-${username}`) : null,
    () => accountSettingsRepository.getTechnologies(username!),
    { revalidateOnFocus: false },
  );

export const useAccountEducations = (username?: string | null) =>
  useSWR<AccountEducation[]>(
    username ? accountSettingsKeys.detail(`educations-${username}`) : null,
    () => accountSettingsRepository.getEducations(username!),
    { revalidateOnFocus: false },
  );

export const useAccountWorkExperiences = (username?: string | null) =>
  useSWR<AccountWorkExperience[]>(
    username ? accountSettingsKeys.detail(`work-experiences-${username}`) : null,
    () => accountSettingsRepository.getWorkExperiences(username!),
    { revalidateOnFocus: false },
  );

export const useAccountTeams = () =>
  useSWR<AccountTeam[]>(accountSettingsKeys.detail('teams'), () => accountSettingsRepository.getTeams(), {
    revalidateOnFocus: false,
  });
