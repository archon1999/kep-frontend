export interface ContestUserStatisticsGeneral {
  username: string;
  ratingTitle: string;
  contestantsCount: number;
  maxRating: number;
  maxRatingTitle: string;
  ratingPlace: number;
  rating: number;
}

export interface ContestUserStatisticsProblemReference {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
}

export interface ContestUserStatisticsOverview {
  totalAttempts: number;
  totalAccepted: number;
  averageAttemptsPerProblem: number;
  mostAttemptsProblem?: ContestUserStatisticsProblemReference & { attemptsCount: number };
  singleAttemptProblems?: { count: number; percentage: number };
  fastestSolve?: ContestUserStatisticsProblemReference & { time: string };
  slowestSolve?: ContestUserStatisticsProblemReference & { time: string };
}

export interface ContestUserStatisticsRank {
  contestId: number;
  contestTitle: string;
  rank: number;
  participantsCount: number;
}

export interface ContestUserStatisticsDelta {
  contestId: number;
  contestTitle: string;
  delta: number;
  participantsCount: number;
}

export interface ContestUserStatisticsContestRanks {
  best?: ContestUserStatisticsRank;
  worst?: ContestUserStatisticsRank;
}

export interface ContestUserStatisticsContestDeltas {
  best?: ContestUserStatisticsDelta;
  worst?: ContestUserStatisticsDelta;
}

export interface ContestUserStatisticsUnsolvedProblem {
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

export interface ContestUserStatisticsTopAttempt extends ContestUserStatisticsProblemReference {
  attemptsCount: number;
  solved: boolean;
}

export interface ContestUserStatisticsOpponentContest {
  contestId: number;
  contestTitle: string;
  userRank: number;
  opponentRank: number;
  userPoints: number;
  opponentPoints: number;
}

export interface ContestUserStatisticsWorthyOpponent {
  opponent: string;
  type: string;
  sharedCount: number;
  contests: ContestUserStatisticsOpponentContest[];
}

export interface ContestUserStatistics {
  general?: ContestUserStatisticsGeneral;
  overview?: ContestUserStatisticsOverview;
  contestRanks?: ContestUserStatisticsContestRanks;
  contestDeltas?: ContestUserStatisticsContestDeltas;
  unsolvedProblems?: ContestUserStatisticsUnsolvedProblem[];
  languages?: ContestUserStatisticsLanguage[];
  verdicts?: ContestUserStatisticsVerdict[];
  tags?: ContestUserStatisticsTag[];
  symbols?: ContestUserStatisticsSymbol[];
  timeline?: ContestUserStatisticsTimelineEntry[];
  topAttempts?: ContestUserStatisticsTopAttempt[];
  worthyOpponents?: ContestUserStatisticsWorthyOpponent[];
}
