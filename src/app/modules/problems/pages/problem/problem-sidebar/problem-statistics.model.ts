export interface ProblemAttemptStatistic {
  verdict: number;
  verdictTitle: string;
  value: number;
  color: string;
}

export interface ProblemLanguageStatistic {
  langFull: string;
  lang: string;
  value: number;
}

export interface ProblemTopAttempt {
  username: string;
  ratingTitle: string;
  time: number;
  memory: number;
  sourceCodeSize: number;
}

export interface ProblemTopAttempts {
  time: ProblemTopAttempt[];
  memory: ProblemTopAttempt[];
  sourceCodeSize: ProblemTopAttempt[];
}

export interface ProblemAttemptsForSolveStatistic {
  attempts: number;
  value: number;
}

export interface ProblemStatistics {
  attemptStatistics: ProblemAttemptStatistic[];
  languageStatistics: ProblemLanguageStatistic[];
  topAttempts: ProblemTopAttempts;
  attemptsForSolveStatistics: ProblemAttemptsForSolveStatistic[];
}
