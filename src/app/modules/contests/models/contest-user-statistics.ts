export interface ContestUserStatistics {
  general: ContestUserStatisticsGeneral;
  overview: ContestUserStatisticsOverview;
  contestRanks: ContestUserStatisticsRanks;
  contestDeltas: ContestUserStatisticsDeltas;
  unsolvedProblems: ContestUserStatisticsProblem[];
  languages: ContestUserStatisticsLanguage[];
  verdicts: ContestUserStatisticsVerdict[];
  tags: ContestUserStatisticsTag[];
  symbols: ContestUserStatisticsSymbol[];
  timeline: ContestUserStatisticsTimelineEntry[];
  topAttempts: ContestUserStatisticsTopAttempt[];
  worthyOpponents: ContestUserStatisticsOpponent[];
}

export interface ContestUserStatisticsGeneral {
  username: string;
  ratingTitle: string;
  contestantsCount: number;
  maxRating: number;
  maxRatingTitle: string;
  ratingPlace: number;
  rating: number;
}

export interface ContestUserStatisticsOverview {
  totalAttempts: number;
  totalAccepted: number;
  averageAttemptsPerProblem: number;
  mostAttemptsProblem: ContestUserStatisticsProblemSummary | null;
  singleAttemptProblems: ContestUserStatisticsSingleAttemptSummary;
  fastestSolve: ContestUserStatisticsSolveInfo | null;
  slowestSolve: ContestUserStatisticsSolveInfo | null;
}

export interface ContestUserStatisticsProblemSummary {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  attemptsCount: number;
}

export interface ContestUserStatisticsSingleAttemptSummary {
  count: number;
  percentage: number;
}

export interface ContestUserStatisticsSolveInfo {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  time: string;
}

export interface ContestUserStatisticsRanks {
  best: ContestUserStatisticsRank | null;
  worst: ContestUserStatisticsRank | null;
}

export interface ContestUserStatisticsRank {
  contestId: number;
  contestTitle: string;
  rank: number;
  participantsCount: number;
}

export interface ContestUserStatisticsDeltas {
  best: ContestUserStatisticsDelta | null;
  worst: ContestUserStatisticsDelta | null;
}

export interface ContestUserStatisticsDelta {
  contestId: number;
  contestTitle: string;
  delta: number;
  participantsCount: number;
}

export interface ContestUserStatisticsProblem {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
}

export interface ContestUserStatisticsLanguage {
  lang: string;
  langFull: string;
  attemptsCount: number;
}

export interface ContestUserStatisticsVerdict {
  verdict: string;
  attemptsCount: number;
}

export interface ContestUserStatisticsTag {
  name: string;
  solved: number;
}

export interface ContestUserStatisticsSymbol {
  symbol: string;
  solved: number;
}

export interface ContestUserStatisticsTimelineEntry {
  range: string;
  attempts: number;
}

export interface ContestUserStatisticsTopAttempt {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  attemptsCount: number;
  solved: boolean;
}

export interface ContestUserStatisticsOpponent {
  opponent: string;
  type: string;
  sharedCount: number;
  contests: ContestUserStatisticsOpponentContest[];
}

export interface ContestUserStatisticsOpponentContest {
  contestId: number;
  contestTitle: string;
  userRank: number;
  opponentRank: number;
  userPoints: number;
  opponentPoints: number;
}
