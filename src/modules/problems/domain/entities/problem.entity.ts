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

export interface SimilarProblem {
  id: number;
  title: string;
  difficulty: number;
  problemRating?: number;
  difficultyTitle?: string;
  score?: number;
  tags: ProblemTag[];
  topics: ProblemTopic[];
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
  problemRating?: number;
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
  similarProblems: SimilarProblem[];
  image?: string | null;
  partialSolvable?: boolean;
  attachments?: ProblemAttachment[];
}

export interface ProblemAttachment {
  id: number;
  name: string;
  url: string;
  size?: number;
  contentType?: string;
  created?: string;
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

export interface ProblemGroup {
  id: number;
  name: string;
  slug: string;
  parent?: number | null;
  order?: number;
  problemsCount?: number;
  children: ProblemGroup[];
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
  judgeSummary?: AttemptJudgeSummary;
}

export interface AttemptDetail extends AttemptListItem {
  sourceCode?: string;
  errorMessage?: string;
  previousAttemptId?: number;
}

export interface AttemptJudgeSummaryTests {
  passed: number;
  total: number;
}

export interface AttemptJudgeSummaryGroup {
  id: string;
  passed: boolean;
  passedCases: number;
  totalCases: number;
  score?: number;
  maxScore?: number;
  failedCase?: number;
  verdict?: number;
  cases: AttemptJudgeSummaryCase[];
}

export interface AttemptJudgeSummarySubtask {
  id: string;
  score: number;
  maxScore: number;
  passed: boolean;
}

export interface AttemptJudgeSummaryCase {
  number: number;
  verdict: Verdicts;
  passed: boolean;
}

export interface AttemptJudgeSummary {
  mode?: string;
  score?: number;
  maxScore?: number;
  tests?: AttemptJudgeSummaryTests;
  groups: AttemptJudgeSummaryGroup[];
  subtasks: AttemptJudgeSummarySubtask[];
  verdict?: number;
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

export interface StudyPlanListItem {
  id: number;
  code?: string;
  title: string;
  descriptionShort: string;
  icon?: string | null;
  themeColor?: string;
  themeColorSecondary?: string;
  daysCount?: number;
  problemsCount?: number;
  isPurchased?: boolean;
  solvedCount?: number;
  progressPercent?: number;
}

export interface StudyPlanDayProblem {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle?: string;
  tags: ProblemTag[];
  likesCount?: number;
  dislikesCount?: number;
  userInfo?: Pick<ProblemUserInfo, 'hasSolved' | 'hasAttempted'>;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  description: string;
  problems: StudyPlanDayProblem[];
}

export interface StudyPlanDetail extends StudyPlanListItem {
  description: string;
  kepcoinValue: number;
  statistics: DifficultyBreakdown;
  days: StudyPlanDay[];
}

export interface RecommendationProgress {
  answered: number;
  total: number;
  percent: number;
}

export interface RecommendationProfile {
  mode: string;
  track?: string | null;
  confidence: string;
  dominantCategory?: string | null;
  inferredLanguage?: string | null;
  inferredLevel?: string | null;
  implicitAnswers: Record<string, string>;
}

export interface RecommendationQuestionOption {
  id: string;
  label: string;
  helper?: string | null;
}

export interface RecommendationQuestion {
  id: string;
  title: string;
  subtitle?: string | null;
  options: RecommendationQuestionOption[];
}

export interface RecommendationFilterPatch {
  category?: string;
  tags?: number[];
  lang?: string;
  exclusive_lang?: string;
  competitive_langs_only?: string;
  difficulty?: string;
  status?: number;
  ordering?: string;
  problem_rating_min?: string;
  problem_rating_max?: string;
  has_solution?: string;
  has_checker?: string;
  partial_solvable?: string;
}

export interface RecommendationResultOption {
  title: string;
  subtitle: string;
  filterPatch: RecommendationFilterPatch;
}

export interface RecommendationQuestionState {
  status: 'question';
  progress: RecommendationProgress;
  profile: RecommendationProfile;
  question: RecommendationQuestion;
}

export interface RecommendationResultState {
  status: 'result';
  progress: RecommendationProgress;
  profile: RecommendationProfile;
  why: string;
  primary: RecommendationResultOption;
  alternatives: RecommendationResultOption[];
  suggestedStudyPlanId?: number | null;
  directProblemId?: number | null;
}

export type RecommendationResolveResponse = RecommendationQuestionState | RecommendationResultState;

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
  avatar?: string;
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

export type ProblemSolversOrdering = '-latest_solved_at' | '-rating' | 'shortest_code_size';

export interface ProblemSolver {
  userId: number;
  username: string;
  avatar?: string;
  rating?: number;
  ratingTitle?: string;
  firstSolvedAt?: string;
  latestSolvedAt?: string;
  attemptsToSolve?: number;
  shortestCodeSize?: number;
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

export type ProblemsStatisticsActivityMeta = Pick<
  ProblemsStatisticsMeta,
  'lastDays' | 'allowedLastDays'
>;

export type ProblemsStatisticsHeatmapMeta = Pick<ProblemsStatisticsMeta, 'heatmapRange'>;

export interface ProblemsUserStatisticsActivity {
  lastDays: { series: number[]; solved: number };
  meta: ProblemsStatisticsActivityMeta;
}

export interface ProblemsUserStatisticsHeatmap {
  heatmap: ProblemsStatisticsHeatmapEntry[];
  meta: ProblemsStatisticsHeatmapMeta;
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
