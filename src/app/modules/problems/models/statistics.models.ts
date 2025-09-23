export interface GeneralInfo {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
}

export interface DifficultyStatistics {
  beginner: number;
  allBeginner: number;
  basic: number;
  allBasic: number;
  normal: number;
  allNormal: number;
  medium: number;
  allMedium: number;
  advanced: number;
  allAdvanced: number;
  hard: number;
  allHard: number;
  extremal: number;
  allExtremal: number;
  totalSolved: number;
  totalProblems: number;
}

export interface LangStatistics {
  lang: string;
  langFull: string;
  solved: number;
}

export interface TagStatistics {
  name: string;
  value: number;
}

export interface TopicStatistics {
  topic: string;
  solved: number;
  code: string;
  id: number;
}

export interface WeekdayStatistics {
  day: string;
  solved: number;
}

export interface MonthStatistics {
  month: string;
  solved: number;
}

export interface PeriodStatistics {
  period: string;
  solved: number;
}

export interface ProblemsFacts {
  firstAttempt: any;
  lastAttempt: any;
  firstAccepted: any;
  lastAccepted: any;
  mostAttemptedProblem: any;
  mostAttemptedForSolveProblem: any;
  solvedWithSingleAttempt: number;
  solvedWithSingleAttemptPercentage: number;
}

export interface LastDaysStatistics {
  series: number[];
  solved: number;
}

export interface HeatmapEntry {
  date: string;
  solved: number;
}

export interface NumberOfAttemptsEntry {
  attemptsCount: number;
  value: number;
}

export interface NumberOfAttemptsStatistics {
  chartSeries: NumberOfAttemptsEntry[];
}

export interface ProblemsStatisticsMeta {
  lastDays: number;
  allowedLastDays: number[];
  heatmapRange?: {
    from: string;
    to: string;
  };
}

export interface ProblemsStatisticsResponse {
  general: GeneralInfo;
  byDifficulty: DifficultyStatistics;
  byTopic: TopicStatistics[];
  byLang: LangStatistics[];
  byTag: TagStatistics[];
  byWeekday: WeekdayStatistics[];
  byMonth: MonthStatistics[];
  byPeriod: PeriodStatistics[];
  facts: ProblemsFacts;
  lastDays: LastDaysStatistics;
  heatmap: HeatmapEntry[];
  numberOfAttempts: NumberOfAttemptsStatistics;
  meta: ProblemsStatisticsMeta;
}
