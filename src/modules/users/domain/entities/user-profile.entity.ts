import {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTechnology,
  AccountWorkExperience,
} from 'modules/account-settings/domain/entities/account-settings.entity';
import { UsersListItem } from './user.entity';

export type UserProfileAbout = {
  generalInfo?: AccountGeneralInfo;
  profileInfo?: AccountProfileInfo;
  skills?: AccountSkills;
  technologies?: AccountTechnology[];
  educations?: AccountEducation[];
  workExperiences?: AccountWorkExperience[];
};

export type UserAchievement = {
  id: number;
  type: number;
  title: string;
  description: string;
  totalProgress: number;
  userResult: {
    progress: number;
    done: boolean;
  };
};

export type UserCompetitionPrizeCurrency = 'SUM' | 'DOLLAR' | 'TON';
export type UserCompetitionPrizeType = 'MONEY' | 'TELEGRAM_PREMIUM' | 'KEPCOIN' | 'MERCH';
export type UserCompetitionPrizeCompetitionType = 'CONTEST' | 'ARENA' | 'TOURNAMENT' | 'CUP';

export type UserCompetitionPrize = {
  prizeTitle: string;
  prizeType: UserCompetitionPrizeType;
  moneyValue: number | null;
  kepcoinValue: number | null;
  currency: UserCompetitionPrizeCurrency;
  competitionType: UserCompetitionPrizeCompetitionType;
  competitionId: number;
  competitionTitle: string;
  telegramPremiumPeriod: number | null;
  note: string;
};

export type UserFollowersPreview = {
  data: UsersListItem[];
  total: number;
};

export type UserSocialLinks = AccountSocialLinks;
