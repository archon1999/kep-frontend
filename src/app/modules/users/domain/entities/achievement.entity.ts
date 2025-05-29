export interface Achievement {
  id: number;
  type: number;
  title: string;
  description: string;
  totalProgress: number;
  userResult: {
    progress: number;
    done: boolean;
  };
}

export type UserCompetitionPrizeCurrency = 'SUM' | 'DOLLAR' | 'TON';
export type UserCompetitionPrizeCompetitionType = 'CONTEST' | 'ARENA' | 'TOURNAMENT' | 'CUP';
export type UserCompetitionPrizeType = 'MONEY' | 'TELEGRAM_PREMIUM' | 'KEPCOIN';

export interface UserCompetitionPrize {
  prizeTitle: string;
  prizeType: UserCompetitionPrizeType;
  moneyValue: number | null;
  kepcoinValue: number | null;
  currency: UserCompetitionPrizeCurrency;
  competitionType: UserCompetitionPrizeCompetitionType;
  competitionId: number;
  competitionTitle: string;
  telegramPremiumPeriod: number | null;
} 