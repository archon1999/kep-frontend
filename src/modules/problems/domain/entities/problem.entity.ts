export enum AttemptLangs {
  PYTHON = 'py',
  CPP = 'cpp',
  R = 'r',
  HASKELL = 'hs',
  KEP = 'kep',
  C = 'c',
  KOTLIN = 'kt',
  TEXT = 'text',
  HTML = 'html',
  SQL = 'sql',
  BASH = 'bash',
  JS = 'js',
  PHP = 'php',
  CSHARP = 'cs',
  JAVA = 'java',
  RUST = 'rs',
  TS = 'ts',
}

export enum Verdicts {
  InQueue = -2,
  Running,
  JudgementFailed,
  Accepted,
  WrongAnswer,
  TimeLimitExceeded,
  RuntimeError,
  OutputFormatError,
  MemoryLimitExceeded,
  Rejected,
  CompilationError,
  CommandExecutingError,
  IdlenessLimitExceeded,
  SyntaxError,
  CheckerNotFound,
  OnlyPython,
  ObjectNotFound,
  FakeAccepted,
  PartialSolution,
  NotAvailableLanguage,
  Hacked,
}

export enum HackAttemptVerdict {
  InQueue = -2,
  Testing = -1,
  CheckerFailed = 0,
  SuccessfulHack = 1,
  UnsuccessfulHack = 2,
  InvalidInput = 3,
  GeneratorIncompilable = 4,
  GeneratorCrashed = 5,
}

export interface ProblemTag {
  id: number;
  name: string;
  category?: string;
}

export interface ProblemUserInfo {
  hasSolved?: boolean;
  hasAttempted?: boolean;
  canViewSolution?: boolean;
  isFavorite?: boolean;
  voteType?: number | null;
}

export interface ProblemTopic {
  id: number;
  name: string;
}

export interface ProblemAvailableLanguage {
  lang: AttemptLangs | string;
  langFull: string;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  codeTemplate?: string | null;
  codeGolf?: number | null;
}

export interface ProblemSampleTest {
  input: string;
  output?: string;
  problem?: number;
}

export interface ProblemListItem {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle?: string;
  solved?: number;
  notSolved?: number;
  attemptsCount?: number;
  tags: ProblemTag[];
  likesCount?: number;
  dislikesCount?: number;
  hasSolution?: boolean;
  hasChecker?: boolean;
  hidden?: boolean;
  userInfo?: ProblemUserInfo;
}

export interface ProblemDetail extends ProblemListItem {
  authorUsername?: string;
  authorAvatar?: string;
  voteType?: number | null;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  availableLanguages: ProblemAvailableLanguage[];
  hasCheckInput?: boolean;
  solutionKepcoinValue?: number;
  checkInputSource?: string;
  body?: string | null;
  inputData?: string | null;
  outputData?: string | null;
  comment?: string | null;
  sampleTests: ProblemSampleTest[];
  topics: ProblemTopic[];
  image?: string | null;
  partialSolvable?: boolean;
}

export interface ProblemUserSummary {
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rating?: number;
  ratingTitle?: string;
}

export interface ProblemsRatingRow {
  rowIndex: number;
  rating?: number;
  solved?: number;
  beginner?: number;
  basic?: number;
  normal?: number;
  medium?: number;
  advanced?: number;
  hard?: number;
  extremal?: number;
  user: ProblemUserSummary;
}

export interface PeriodRatingEntry {
  username: string;
  solved: number;
  ratingTitle?: string;
}

export type ProblemsRatingHistoryType = 1 | 2 | 3;

export interface ProblemsRatingHistoryEntry {
  username: string;
  contestsRatingTitle?: string;
  type: ProblemsRatingHistoryType;
  result?: number;
  date: string;
}

export interface ProblemLanguageOption {
  lang: string;
  langFull: string;
}

export interface ProblemCategory {
  id: number;
  title: string;
  code: string;
  description: string;
  problemsCount?: number;
  tags: ProblemTag[];
}

export interface ProblemAttemptSummary {
  id: number;
  problemId: number;
  problemTitle: string;
}

export interface AttemptListItem {
  id: number;
  user: ProblemUserSummary;
  teamName?: string;
  problemId: number;
  problemTitle: string;
  contestProblemSymbol?: string;
  contestId?: number;
  contestTime?: string | null;
  verdict?: number;
  verdictTitle: string;
  lang: string;
  langFull: string;
  testCaseNumber?: number | null;
  time?: number;
  memory?: number;
  sourceCodeSize?: number;
  balls?: number | null;
  canView?: boolean;
  canTestView?: boolean;
  kepcoinValue?: number;
  testCaseKepcoinValue?: number;
  created?: string;
  problemHasCheckInput?: boolean;
}

export interface AttemptDetail extends AttemptListItem {
  sourceCode?: string;
  errorMessage?: string;
}

export interface AttemptFilterOption {
  label: string;
  value: number;
}

export interface ProblemContestPreview {
  id: number;
  title: string;
  problems: Array<{
    id: number;
    symbol?: string;
    title: string;
  }>;
}

export interface DifficultyBreakdown {
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

export interface ProblemsRatingSummary {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
  difficulties: DifficultyBreakdown;
}

export interface ProblemSolutionCode {
  lang: string;
  code: string;
}

export interface ProblemSolution {
  solution: string;
  codes: ProblemSolutionCode[];
}

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
  ratingTitle?: string;
  time?: number;
  memory?: number;
  sourceCodeSize?: number;
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

export interface HackAttempt {
  id: number;
  attemptId: number;
  hackType: string;
  hackerUsername: string;
  hackerRatingTitle?: string;
  defenderUsername: string;
  defenderRatingTitle?: string;
  problemId: number;
  problemTitle: string;
  verdict?: HackAttemptVerdict;
  verdictTitle: string;
  created?: string;
}

export interface ProblemVoteResult {
  likesCount: number;
  dislikesCount: number;
  voteType?: number | null;
  isFavorite?: boolean;
}

export interface ProblemsStatisticsGeneralInfo {
  solved: number;
  rating: number;
  rank: number | string;
  usersCount: number;
}

export interface ProblemsStatisticsLangStat {
  lang: string;
  langFull: string;
  solved: number;
}

export interface ProblemsStatisticsTagStat {
  name: string;
  value: number;
}

export interface ProblemsStatisticsTopicStat {
  id: number;
  topic: string;
  code?: string;
  solved: number;
}

export interface ProblemsStatisticsFactAttempt {
  problemId?: number;
  problemTitle?: string;
  datetime?: string;
  verdict?: number;
  verdictTitle?: string;
  attemptsCount?: number;
}

export interface ProblemsStatisticsFacts {
  firstAttempt?: ProblemsStatisticsFactAttempt | null;
  lastAttempt?: ProblemsStatisticsFactAttempt | null;
  firstAccepted?: ProblemsStatisticsFactAttempt | null;
  lastAccepted?: ProblemsStatisticsFactAttempt | null;
  mostAttemptedProblem?: ProblemsStatisticsFactAttempt | null;
  mostAttemptedForSolveProblem?: ProblemsStatisticsFactAttempt | null;
  solvedWithSingleAttempt?: number;
  solvedWithSingleAttemptPercentage?: number;
}

export interface ProblemsStatisticsTimeEntry {
  label: string;
  solved: number;
}

export interface ProblemsStatisticsHeatmapEntry {
  date: string;
  solved: number;
}

export interface ProblemsStatisticsAttemptsChartEntry {
  attemptsCount: number;
  value: number;
}

export interface ProblemsStatisticsMeta {
  lastDays?: number;
  allowedLastDays: number[];
  heatmapRange?: {
    from?: string;
    to?: string;
  };
}

export interface ProblemsUserStatistics {
  general: ProblemsStatisticsGeneralInfo;
  byDifficulty: DifficultyBreakdown;
  byTopic: ProblemsStatisticsTopicStat[];
  facts: ProblemsStatisticsFacts;
  byLang: ProblemsStatisticsLangStat[];
  byTag: ProblemsStatisticsTagStat[];
  byWeekday: ProblemsStatisticsTimeEntry[];
  byMonth: ProblemsStatisticsTimeEntry[];
  byPeriod: ProblemsStatisticsTimeEntry[];
  lastDays: { series: number[]; solved: number };
  heatmap: ProblemsStatisticsHeatmapEntry[];
  numberOfAttempts: { chartSeries: ProblemsStatisticsAttemptsChartEntry[] };
  meta: ProblemsStatisticsMeta;
}
