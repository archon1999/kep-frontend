export interface ContestStatistics {
  general: ContestStatisticsGeneral;
  timeline: ContestStatisticsTimelinePoint[];
  verdicts: ContestStatisticsVerdicts;
  records: ContestStatisticsRecords;
  badges: ContestStatisticsBadges;
}

export interface ContestStatisticsGeneral {
  participants: number;
  attempts: {
    total: number;
    byProblem: Record<string, number>;
  };
  accepted: {
    total: number;
    byProblem: Record<string, number>;
  };
  acceptanceRate: number;
}

export interface ContestStatisticsTimelinePoint {
  range: string;
  attempts: number;
}

export interface ContestStatisticsVerdicts {
  accepted: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  other: number;
}

export interface ContestStatisticsRecords {
  firstSolves: Record<string, ContestStatisticSolveRecord>;
  lastAccepted?: ContestStatisticSolveRecord & { problem: string };
  mostAttemptsContestant?: ContestStatisticAttemptsRecord;
}

export interface ContestStatisticContestant {
  user: ContestStatisticUser;
  team: any;
}

export interface ContestStatisticUser {
  id: number;
  username: string;
  userFullName: string | null;
  ratingTitle: string | null;
  avatar: string | null;
}

export interface ContestStatisticSolveRecord {
  contestant: ContestStatisticContestant;
  contestTimeSeconds: number;
  time: string;
  timestamp: string;
}

export interface ContestStatisticAttemptsRecord {
  contestant: ContestStatisticContestant;
  attempts: number;
}

export interface ContestStatisticsBadges {
  sniper?: ContestStatisticBadge;
  grinder?: ContestStatisticBadge;
  optimizer?: ContestStatisticBadge;
  neverGiveUp?: ContestStatisticBadge;
  [key: string]: ContestStatisticBadge | undefined;
}

export interface ContestStatisticBadge {
  contestant: ContestStatisticContestant;
  problem?: string;
  time?: string;
  timestamp?: string;
  attempts?: number;
  wrongAttempts?: number;
  solvedProblems?: number;
}
