import { ContestProblemInfo } from './contest-problem.entity';

export interface ContestantTeamMember {
  username?: string;
  avatar?: string | null;
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
  id?: number;
  rowType?: 'official' | 'upsolve';
  username: string;
  avatar?: string | null;
  userFullName?: string;
  team?: ContestantTeam | null;
  type?: number;
  problemsInfo: ContestProblemInfo[];
  points?: number;
  solvedCount?: number;
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

export interface ContestantProgressPoint {
  contestTimeSeconds: number;
  contestTime: string;
  solvedCount: number;
  attemptsCount: number;
  problemSymbol?: string | null;
  verdict?: number | null;
}

export interface ContestantTimeline {
  contestant: ContestantEntity;
  durationSeconds: number;
  points: ContestantProgressPoint[];
}
