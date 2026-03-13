import useSWRMutation from 'swr/mutation';
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
  ChangePasswordPayload,
} from '../domain/entities/account-settings.entity';
import { accountSettingsKeys } from './queries';

const repository = new HttpAccountSettingsRepository();

type UpdatePayload<T> = { username: string; payload: T };

type Mutator<Res, Payload> = ReturnType<typeof useSWRMutation<Res, Error, readonly unknown[], Payload>>;

export const useUpdateGeneralInfo = (): Mutator<AccountGeneralInfo, UpdatePayload<AccountGeneralInfo>> =>
  useSWRMutation(accountSettingsKeys.detail('general-info-update'), (_, { arg }) =>
    repository.updateGeneralInfo(arg.username, arg.payload),
  );

export const useUpdateProfileInfo = (): Mutator<AccountProfileInfo, UpdatePayload<AccountProfileInfo>> =>
  useSWRMutation(accountSettingsKeys.detail('profile-info-update'), (_, { arg }) =>
    repository.updateProfileInfo(arg.username, arg.payload),
  );

export const useUpdateSocial = (): Mutator<AccountSocialLinks, UpdatePayload<AccountSocialLinks>> =>
  useSWRMutation(accountSettingsKeys.detail('social-update'), (_, { arg }) =>
    repository.updateSocial(arg.username, arg.payload),
  );

export const useUpdateSkills = (): Mutator<AccountSkills, UpdatePayload<AccountSkills>> =>
  useSWRMutation(accountSettingsKeys.detail('skills-update'), (_, { arg }) =>
    repository.updateSkills(arg.username, arg.payload),
  );

export const useUpdateTechnologies = (): Mutator<AccountTechnology[], UpdatePayload<AccountTechnology[]>> =>
  useSWRMutation(accountSettingsKeys.detail('technologies-update'), (_, { arg }) =>
    repository.updateTechnologies(arg.username, arg.payload),
  );

export const useUpdateEducations = (): Mutator<AccountEducation[], UpdatePayload<AccountEducation[]>> =>
  useSWRMutation(accountSettingsKeys.detail('educations-update'), (_, { arg }) =>
    repository.updateEducations(arg.username, arg.payload),
  );

export const useUpdateWorkExperiences = (): Mutator<AccountWorkExperience[], UpdatePayload<AccountWorkExperience[]>> =>
  useSWRMutation(accountSettingsKeys.detail('work-experiences-update'), (_, { arg }) =>
    repository.updateWorkExperiences(arg.username, arg.payload),
  );

export const useChangePassword = (): Mutator<void, UpdatePayload<ChangePasswordPayload>> =>
  useSWRMutation(accountSettingsKeys.detail('change-password'), (_, { arg }) =>
    repository.changePassword(arg.username, arg.payload),
  );

export const useCreateTeam = (): Mutator<AccountTeam, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-create'), (_, { arg }) => repository.createTeam(arg));

export const useJoinTeam = (): Mutator<AccountTeam, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-join'), (_, { arg }) => repository.joinTeam(arg));

export const useRefreshTeamCode = (): Mutator<AccountTeam, string> =>
  useSWRMutation(accountSettingsKeys.detail('teams-refresh'), (_, { arg }) => repository.refreshTeamCode(arg));
