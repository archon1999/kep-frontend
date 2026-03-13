import { ContestantTeamMember } from './contestant.entity';

export interface ContestStatisticsSummary {
  total: number;
  byProblem: Record<string, number>;
}

export interface ContestStatisticsGeneral {
  participants: number;
  attempts: ContestStatisticsSummary;
  accepted: ContestStatisticsSummary;
  acceptanceRate: number;
}

export interface ContestStatisticsTimelineEntry {
  range: string;
  attempts: number;
}

export interface ContestStatisticsVerdicts {
  accepted: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  other: number;
}

export interface ContestStatisticsContestant {
  username?: string;
  fullName?: string | null;
  ratingTitle?: string;
  teamName?: string;
  teamMembers?: ContestantTeamMember[];
  avatar?: string;
}

export interface ContestStatisticsFirstSolve {
  contestant: ContestStatisticsContestant;
  contestTimeSeconds?: number;
  time?: string;
  timestamp?: string;
}

export interface ContestStatisticsBadgeEntry {
  contestant: ContestStatisticsContestant | null;
  problem?: string;
  time?: string;
  attempts?: number;
  solvedProblems?: number;
  wrongAttempts?: number;
}

export interface ContestStatisticsBadges {
  sniper?: ContestStatisticsBadgeEntry;
  grinder?: ContestStatisticsBadgeEntry;
  optimizer?: ContestStatisticsBadgeEntry;
  neverGiveUp?: ContestStatisticsBadgeEntry;
}

export interface ContestStatistics {
  general: ContestStatisticsGeneral;
  timeline: ContestStatisticsTimelineEntry[];
  verdicts: ContestStatisticsVerdicts;
  firstSolves: Record<string, ContestStatisticsFirstSolve>;
  badges: ContestStatisticsBadges;
  facts: string[];
}
