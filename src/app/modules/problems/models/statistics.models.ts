export interface GeneralInfo {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
}

export interface LangInfo {
  lang: string;
  langFull: string;
  solved: number;
}

export interface TagInfo {
  name: string;
  value: number;
}

export interface TopicInfo {
  topic: string;
  solved: number;
  code: string;
  id: number;
  icon?: string;
}

export interface Difficulties {
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

export interface AttemptFact {
  problemId: number;
  problemTitle: string;
  datetime: string;
  verdict?: number;
  verdictTitle?: string;
  testCaseNumber?: number;
  attemptsCount?: number;
}

export interface Facts {
  firstAttempt: AttemptFact | null;
  lastAttempt: AttemptFact | null;
  firstAccepted: AttemptFact | null;
  lastAccepted: AttemptFact | null;
  mostAttemptedProblem: AttemptFact | null;
  mostAttemptedForSolveProblem: AttemptFact | null;
  solvedWithSingleAttempt: number;
  solvedWithSingleAttemptPercentage: number;
}

export interface WeekdaySolved {
  day: string;
  solved: number;
}

export interface MonthSolved {
  month: string;
  solved: number;
}

export interface PeriodSolved {
  period: string;
  solved: number;
}

export interface LastDays {
  series: number[];
  solved: number;
}

export interface HeatmapEntry {
  date: string;
  solved: number;
}

export interface NumberOfAttemptsPoint {
  attemptsCount: number;
  value: number;
}

export interface NumberOfAttempts {
  chartSeries: NumberOfAttemptsPoint[];
}

export interface ProblemsStatisticsMeta {
  lastDays: number;
  allowedLastDays: number[];
  heatmapRange?: {
    from: string;
    to: string;
  };
}

export interface ProblemsStatistics {
  general: GeneralInfo;
  byDifficulty: Difficulties;
  byTopic: TopicInfo[];
  facts: Facts;
  byLang: LangInfo[];
  byWeekday: WeekdaySolved[];
  byMonth: MonthSolved[];
  byPeriod: PeriodSolved[];
  byTag: TagInfo[];
  byVerdict?: any;
  lastDays: LastDays;
  heatmap: HeatmapEntry[];
  numberOfAttempts: NumberOfAttempts;
  meta: ProblemsStatisticsMeta;
}
