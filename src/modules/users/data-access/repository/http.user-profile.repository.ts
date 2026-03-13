import { mapApiUserToDomain } from '../mappers/user.mapper';
import { usersApiClient } from '../api/users.client';
import {
  UserAchievement,
  UserCompetitionPrize,
  UserFollowersPreview,
  UserProfileAbout,
  UserSocialLinks,
} from '../../domain/entities/user-profile.entity';
import { UserProfileRepository } from '../../domain/ports/user-profile.repository';

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const mapProfileInfo = (payload: any) => ({
  country: payload?.country,
  region: payload?.region,
  website: payload?.website,
  email: payload?.email,
  emailVisible: payload?.emailVisible ?? payload?.email_visible,
  dateJoined: payload?.dateJoined ?? payload?.date_joined,
  dateOfBirth: payload?.dateOfBirth ?? payload?.date_of_birth,
  bio: payload?.bio,
});

const mapGeneralInfo = (payload: any) => ({
  username: payload?.username,
  firstName: payload?.firstName ?? payload?.first_name,
  lastName: payload?.lastName ?? payload?.last_name,
  email: payload?.email,
  avatar: payload?.avatar,
  coverPhoto: payload?.coverPhoto ?? payload?.cover_photo,
});

const mapSkills = (payload: any) => ({
  python: payload?.python ?? 0,
  webDevelopment: payload?.webDevelopment ?? payload?.web_development ?? 0,
  webScraping: payload?.webScraping ?? payload?.web_scraping ?? 0,
  algorithms: payload?.algorithms ?? 0,
  dataScience: payload?.dataScience ?? payload?.data_science ?? 0,
});

const mapTechnology = (payload: any) => ({
  text: payload?.text ?? '',
  devIconClass: payload?.devIconClass ?? payload?.dev_icon_class ?? '',
  badgeColor: payload?.badgeColor ?? payload?.badge_color ?? '',
});

const mapEducation = (payload: any) => ({
  organization: payload?.organization ?? '',
  degree: payload?.degree ?? '',
  fromYear: payload?.fromYear ?? payload?.from_year ?? null,
  toYear: payload?.toYear ?? payload?.to_year ?? null,
});

const mapWorkExperience = (payload: any) => ({
  company: payload?.company ?? '',
  jobTitle: payload?.jobTitle ?? payload?.job_title ?? '',
  fromYear: payload?.fromYear ?? payload?.from_year ?? null,
  toYear: payload?.toYear ?? payload?.to_year ?? null,
});

const mapAchievement = (payload: any): UserAchievement => ({
  id: payload?.id ?? 0,
  type: payload?.type ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? '',
  totalProgress: payload?.totalProgress ?? payload?.total_progress ?? 0,
  userResult: {
    progress: payload?.userResult?.progress ?? payload?.user_result?.progress ?? 0,
    done: payload?.userResult?.done ?? payload?.user_result?.done ?? false,
  },
});

const mapCompetitionPrize = (payload: any): UserCompetitionPrize => ({
  prizeTitle: payload?.prizeTitle ?? payload?.prize_title ?? '',
  prizeType: payload?.prizeType ?? payload?.prize_type ?? 'MONEY',
  moneyValue: toNumber(payload?.moneyValue ?? payload?.money_value),
  kepcoinValue: toNumber(payload?.kepcoinValue ?? payload?.kepcoin_value),
  currency: payload?.currency,
  competitionType: payload?.competitionType ?? payload?.competition_type ?? 'CONTEST',
  competitionId: payload?.competitionId ?? payload?.competition_id ?? 0,
  competitionTitle: payload?.competitionTitle ?? payload?.competition_title ?? '',
  telegramPremiumPeriod:
    toNumber(payload?.telegramPremiumPeriod ?? payload?.telegram_premium_period) ?? null,
  note: payload?.note ?? '',
});

const mapFollowers = (payload: any): UserFollowersPreview => {
  const data = (payload?.data ?? []).map(mapApiUserToDomain);
  const total = payload?.total ?? payload?.count ?? data.length;
  return { data, total };
};

export class HttpUserProfileRepository implements UserProfileRepository {
  async getAbout(username: string): Promise<UserProfileAbout> {
    const [generalInfo, profileInfo, skills, technologies, educations, workExperiences] =
      await Promise.all([
        usersApiClient.generalInfo(username),
        usersApiClient.profileInfo(username),
        usersApiClient.skills(username),
        usersApiClient.technologies(username),
        usersApiClient.educations(username),
        usersApiClient.workExperiences(username),
      ]);

    return {
      generalInfo: generalInfo ? mapGeneralInfo(generalInfo) : undefined,
      profileInfo: profileInfo ? mapProfileInfo(profileInfo) : undefined,
      skills: skills ? mapSkills(skills) : undefined,
      technologies: Array.isArray(technologies) ? technologies.map(mapTechnology) : [],
      educations: Array.isArray(educations) ? educations.map(mapEducation) : [],
      workExperiences: Array.isArray(workExperiences)
        ? workExperiences.map(mapWorkExperience)
        : [],
    };
  }

  async getSocial(username: string): Promise<UserSocialLinks | undefined> {
    const payload = await usersApiClient.social(username);
    if (!payload) return undefined;
    return {
      telegram: payload?.telegram,
      codeforcesHandle: payload?.codeforcesHandle ?? payload?.codeforces_handle,
      codeforcesBadge: payload?.codeforcesBadge ?? payload?.codeforces_badge,
    };
  }

  async getAchievements(username: string): Promise<UserAchievement[]> {
    const payload = await usersApiClient.achievements(username);
    const data = Array.isArray(payload?.data) ? payload.data : payload;
    return Array.isArray(data) ? data.map(mapAchievement) : [];
  }

  async getCompetitionPrizes(username: string): Promise<UserCompetitionPrize[]> {
    const payload = await usersApiClient.competitionPrizes(username);
    const data = Array.isArray(payload?.data) ? payload.data : payload;
    return Array.isArray(data) ? data.map(mapCompetitionPrize) : [];
  }

  async getFollowers(
    username: string,
    params?: { page?: number; pageSize?: number },
  ): Promise<UserFollowersPreview> {
    const payload = await usersApiClient.followers(username, params);
    return mapFollowers(payload);
  }
}
