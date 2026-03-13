import {
  UserAchievement,
  UserCompetitionPrize,
  UserFollowersPreview,
  UserProfileAbout,
  UserSocialLinks,
} from '../entities/user-profile.entity';

export interface UserProfileRepository {
  getAbout: (username: string) => Promise<UserProfileAbout>;
  getSocial: (username: string) => Promise<UserSocialLinks | undefined>;
  getAchievements: (username: string) => Promise<UserAchievement[]>;
  getCompetitionPrizes: (username: string) => Promise<UserCompetitionPrize[]>;
  getFollowers: (username: string, params?: { page?: number; pageSize?: number }) => Promise<UserFollowersPreview>;
}
