import { ContestProblemInfo } from './contest-problem.entity';

export interface ContestantTeamMember {
  username?: string;
  rating?: number;
  ratingTitle?: string;
  newRating?: number;
  newRatingTitle?: string;
}

export interface ContestantTeam {
  name?: string;
  members: ContestantTeamMember[];
}

export interface ContestantEntity {
  username: string;
  userFullName?: string;
  team?: ContestantTeam | null;
  type?: number;
  problemsInfo: ContestProblemInfo[];
  points?: number;
  penalties?: number;
  rank?: number;
  rating?: number;
  ratingTitle?: string;
  seed?: number;
  delta?: number;
  bonus?: number;
  performance?: number;
  performanceTitle?: string;
  newRating?: number;
  newRatingTitle?: string;
  doubleRatingPurchased?: boolean;
  saveRatingPurchased?: boolean;
  isVirtual?: boolean;
  isUnrated?: boolean;
  isOfficial?: boolean;
  virtualTime?: string;
  country?: string;
  rowIndex?: number;
  rowClass?: string;
}

export interface ContestFilter {
  id: number | string;
  name: string;
}
