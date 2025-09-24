export interface ContestUserStatisticsGeneral {
  username: string;
  ratingTitle: string;
  contestantsCount: number;
  maxRating: number;
  maxRatingTitle: string;
  ratingPlace: number;
  rating: number;
}

export interface ContestUserStatisticsMostAttemptsProblem {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  attemptsCount: number;
}

export interface ContestUserStatisticsSingleAttemptProblems {
  count: number;
  percentage: number;
}

export interface ContestUserStatisticsSolvedTime {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
  time: string;
}

export interface ContestUserStatisticsOverview {
  totalAttempts: number;
  totalAccepted: number;
  averageAttemptsPerProblem: number;
  mostAttemptsProblem: ContestUserStatisticsMostAttemptsProblem | null;
  singleAttemptProblems: ContestUserStatisticsSingleAttemptProblems | null;
  fastestSolve: ContestUserStatisticsSolvedTime | null;
  slowestSolve: ContestUserStatisticsSolvedTime | null;
}

export interface ContestUserStatisticsContestRankEntry {
  contestId: number;
  contestTitle: string;
  rank: number;
  participantsCount: number;
}

export interface ContestUserStatisticsContestRanks {
  best: ContestUserStatisticsContestRankEntry | null;
  worst: ContestUserStatisticsContestRankEntry | null;
}

export interface ContestUserStatisticsContestDeltaEntry {
  contestId: number;
  contestTitle: string;
  delta: number;
  participantsCount: number;
}

export interface ContestUserStatisticsContestDeltas {
  best: ContestUserStatisticsContestDeltaEntry | null;
  worst: ContestUserStatisticsContestDeltaEntry | null;
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

export interface ContestUserStatisticsTopAttempt {
  contestId: number;
  contestTitle: string;
  problemSymbol: string;
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

export interface ContestUserStatisticsOpponent {
  opponent: string;
  type: string;
  sharedCount: number;
  userWins: number;
  opponentWins: number;
  contests: ContestUserStatisticsOpponentContest[];
}

export interface ContestUserStatisticsResponse {
  general: ContestUserStatisticsGeneral;
  overview: ContestUserStatisticsOverview;
  contestRanks: ContestUserStatisticsContestRanks | null;
  contestDeltas: ContestUserStatisticsContestDeltas | null;
  unsolvedProblems: ContestUserStatisticsUnsolvedProblem[];
  languages: ContestUserStatisticsLanguage[];
  verdicts: ContestUserStatisticsVerdict[];
  tags: ContestUserStatisticsTag[];
  symbols: ContestUserStatisticsSymbol[];
  timeline: ContestUserStatisticsTimelineEntry[];
  topAttempts: ContestUserStatisticsTopAttempt[];
  worthyOpponents: ContestUserStatisticsOpponent[];
}
