import useSWRMutation from 'swr/mutation';
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
} from '../domain';
import { accountSettingsRepository } from '../data-access';
import { accountSettingsKeys } from './keys';

type UpdatePayload<T> = { username: string; payload: T };

type Mutator<Res, Payload> = ReturnType<typeof useSWRMutation<Res, Error, readonly unknown[], Payload>>;

export const useUpdateGeneralInfo = (): Mutator<AccountGeneralInfo, UpdatePayload<AccountGeneralInfo>> =>
  useSWRMutation(accountSettingsKeys.detail('general-info-update'), (_, { arg }) =>
    accountSettingsRepository.updateGeneralInfo(arg.username, arg.payload),
  );

export const useUpdateProfileInfo = (): Mutator<AccountProfileInfo, UpdatePayload<AccountProfileInfo>> =>
  useSWRMutation(accountSettingsKeys.detail('profile-info-update'), (_, { arg }) =>
    accountSettingsRepository.updateProfileInfo(arg.username, arg.payload),
  );

export const useUpdateSocial = (): Mutator<AccountSocialLinks, UpdatePayload<AccountSocialLinks>> =>
  useSWRMutation(accountSettingsKeys.detail('social-update'), (_, { arg }) =>
    accountSettingsRepository.updateSocial(arg.username, arg.payload),
  );

export const useUpdateSkills = (): Mutator<AccountSkills, UpdatePayload<AccountSkills>> =>
  useSWRMutation(accountSettingsKeys.detail('skills-update'), (_, { arg }) =>
    accountSettingsRepository.updateSkills(arg.username, arg.payload),
  );

export const useUpdateTechnologies = (): Mutator<AccountTechnology[], UpdatePayload<AccountTechnology[]>> =>
  useSWRMutation(accountSettingsKeys.detail('technologies-update'), (_, { arg }) =>
    accountSettingsRepository.updateTechnologies(arg.username, arg.payload),
  );

export const useUpdateEducations = (): Mutator<AccountEducation[], UpdatePayload<AccountEducation[]>> =>
  useSWRMutation(accountSettingsKeys.detail('educations-update'), (_, { arg }) =>
    accountSettingsRepository.updateEducations(arg.username, arg.payload),
  );

export const useUpdateWorkExperiences = (): Mutator<AccountWorkExperience[], UpdatePayload<AccountWorkExperience[]>> =>
  useSWRMutation(accountSettingsKeys.detail('work-experiences-update'), (_, { arg }) =>
    accountSettingsRepository.updateWorkExperiences(arg.username, arg.payload),
  );

export const useChangePassword = (): Mutator<void, UpdatePayload<ChangePasswordPayload>> =>
  useSWRMutation(accountSettingsKeys.detail('change-password'), (_, { arg }) =>
    accountSettingsRepository.changePassword(arg.username, arg.payload),
  );

export const useCreateTeam = (): Mutator<AccountTeam, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-create'), (_, { arg }) =>
    accountSettingsRepository.createTeam(arg),
  );

export const useJoinTeam = (): Mutator<AccountTeam, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-join'), (_, { arg }) =>
    accountSettingsRepository.joinTeam(arg),
  );

export const useDeleteTeam = (): Mutator<void, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-delete'), (_, { arg }) =>
    accountSettingsRepository.deleteTeam(arg),
  );

export const useRefreshTeamCode = (): Mutator<AccountTeam, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-refresh'), (_, { arg }) =>
    accountSettingsRepository.refreshTeamCode(arg),
  );
