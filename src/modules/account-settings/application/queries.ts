import { createKeyFactory } from 'shared/api';
import useSWR from 'swr';
import { HttpAccountSettingsRepository } from '../data-access/repository/http.account-settings.repository';
import type {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTeam,
  AccountTechnology,
  AccountWorkExperience,
} from '../domain/entities/account-settings.entity';

export const accountSettingsKeys = createKeyFactory('account-settings');
const repository = new HttpAccountSettingsRepository();

export const useAccountGeneralInfo = (username?: string | null) =>
  useSWR<AccountGeneralInfo>(
    username ? accountSettingsKeys.detail(`general-info-${username}`) : null,
    () => repository.getGeneralInfo(username!),
    { revalidateOnFocus: false },
  );

export const useAccountProfileInfo = (username?: string | null) =>
  useSWR<AccountProfileInfo>(
    username ? accountSettingsKeys.detail(`profile-info-${username}`) : null,
    () => repository.getProfileInfo(username!),
    { revalidateOnFocus: false },
  );

export const useAccountSocial = (username?: string | null) =>
  useSWR<AccountSocialLinks>(
    username ? accountSettingsKeys.detail(`social-${username}`) : null,
    () => repository.getSocial(username!),
    { revalidateOnFocus: false },
  );

export const useAccountSkills = (username?: string | null) =>
  useSWR<AccountSkills>(
    username ? accountSettingsKeys.detail(`skills-${username}`) : null,
    () => repository.getSkills(username!),
    { revalidateOnFocus: false },
  );

export const useAccountTechnologies = (username?: string | null) =>
  useSWR<AccountTechnology[]>(
    username ? accountSettingsKeys.detail(`technologies-${username}`) : null,
    () => repository.getTechnologies(username!),
    { revalidateOnFocus: false },
  );

export const useAccountEducations = (username?: string | null) =>
  useSWR<AccountEducation[]>(
    username ? accountSettingsKeys.detail(`educations-${username}`) : null,
    () => repository.getEducations(username!),
    { revalidateOnFocus: false },
  );

export const useAccountWorkExperiences = (username?: string | null) =>
  useSWR<AccountWorkExperience[]>(
    username ? accountSettingsKeys.detail(`work-experiences-${username}`) : null,
    () => repository.getWorkExperiences(username!),
    { revalidateOnFocus: false },
  );

export const useAccountTeams = () =>
  useSWR<AccountTeam[]>(accountSettingsKeys.detail('teams'), () => repository.getTeams(), {
    revalidateOnFocus: false,
  });
