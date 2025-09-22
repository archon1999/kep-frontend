import { ContestStatisticsBadges, ContestStatisticsContestant, ContestStatisticsFirstSolve } from '@contests/models';

export interface ContestStatisticsOverviewCard {
  key: string;
  label: string;
  value: number;
  format?: 'percent';
  icon: string;
  iconColor: string;
}

export interface ContestStatisticsBadgeCard {
  key: keyof ContestStatisticsBadges;
  title: string;
  icon: string;
  color: string;
  contestant: ContestStatisticsContestant | null;
  problem?: string;
  time?: string;
  attempts?: number;
  solvedProblems?: number;
  wrongAttempts?: number;
}

export interface ContestStatisticsFirstSolveEntry {
  problem: string;
  record: ContestStatisticsFirstSolve;
}
