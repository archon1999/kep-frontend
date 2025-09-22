import { ContestantTeamMember } from '@contests/models/contestant-team-member';

export interface ContestStatistics {
  general: ContestStatisticsGeneral;
  timeline: ContestStatisticsTimelineEntry[];
  verdicts: ContestStatisticsVerdicts;
  firstSolves: Record<string, ContestStatisticsFirstSolve>;
  badges: ContestStatisticsBadges;
  facts: string[];
}

export interface ContestStatisticsGeneral {
  participants: number;
  attempts: ContestStatisticsSummary;
  accepted: ContestStatisticsSummary;
  acceptanceRate: number;
}

export interface ContestStatisticsSummary {
  total: number;
  byProblem: Record<string, number>;
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
  user: ContestStatisticsUser;
  team: ContestStatisticsTeam | null;
}

export interface ContestStatisticsUser {
  id: number;
  username: string;
  userFullName: string | null;
  ratingTitle: string;
  avatar: string;
}

export interface ContestStatisticsTeam {
  name: string;
  members: ContestantTeamMember[];
}

export interface ContestStatisticsFirstSolve {
  contestant: ContestStatisticsContestant;
  contestTimeSeconds: number;
  time: string;
  timestamp: string;
}

export interface ContestStatisticsBadges {
  sniper?: ContestStatisticsSniperBadge;
  grinder?: ContestStatisticsGrinderBadge;
  optimizer?: ContestStatisticsOptimizerBadge;
  neverGiveUp?: ContestStatisticsNeverGiveUpBadge;
}

export interface ContestStatisticsSniperBadge {
  contestant: ContestStatisticsContestant;
  problem: string;
  time: string;
  timestamp: string;
}

export interface ContestStatisticsGrinderBadge {
  contestant: ContestStatisticsContestant;
  attempts: number;
}

export interface ContestStatisticsOptimizerBadge {
  contestant: ContestStatisticsContestant;
  wrongAttempts: number;
  solvedProblems: number;
}

export interface ContestStatisticsNeverGiveUpBadge {
  contestant: ContestStatisticsContestant;
  problem: string;
  attempts: number;
  time: string;
  timestamp: string;
}
