export enum KepcoinEarnType {
  WroteBlog = 1,
  WroteProblemSolution = 2,
  LoyaltyBonus = 3,
  BonusFromAdmin = 4,
  DailyActivity = 5,
  DailyTaskCompletion = 6,
  DailyProblemsRatingWin = 7,
  WeeklyProblemsRatingWin = 8,
  MonthlyProblemsRatingWin = 9,
  ContestParticipated = 10,
  ArenaParticipated = 11,
  TournamentParticipated = 12,
  ProjectTaskComplete = 13,
  NewYear2026Login = 14,
  MerchRefund = 15,
  OneTimeTaskCompletion = 16,
}

export enum KepcoinSpendType {
  AttemptView = 1,
  AttemptTestView = 2,
  ProblemSolution = 3,
  DoubleRating = 4,
  CoverPhotoChange = 5,
  Course = 6,
  StudyPlan = 7,
  CodeEditorTesting = 8,
  SaveRating = 9,
  TestPass = 10,
  UserContestCreate = 11,
  Project = 12,
  StreakFreeze = 13,
  VirtualContest = 14,
  UnratedContest = 15,
  AnswerForInput = 16,
  CheckSamples = 17,
  Merch = 18,
}

export interface KepcoinSummary {
  balance: number;
  streak: number;
  maxStreak: number;
  streakFreeze: number;
}

export interface KepcoinHistoryItemBase {
  id: string;
  amount: number;
  happenedAt?: string | null;
  note?: string | null;
  detail?: unknown;
}

export interface KepcoinEarnHistoryItem extends KepcoinHistoryItemBase {
  earnType: KepcoinEarnType;
}

export interface KepcoinSpendHistoryItem extends KepcoinHistoryItemBase {
  spendType: KepcoinSpendType;
}

export interface KepcoinHistoryResponse<T extends KepcoinHistoryItemBase> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pagesCount: number;
}

export type TaskStatus = 'available' | 'completed' | 'blocked';
export type TaskKind = 'provider_link' | 'internal_link' | 'external_link';
export type ProviderType = 'telegram' | 'google-oauth2' | 'github';

export interface OneTimeTask {
  id: number;
  slug: string;
  title: string;
  description: string;
  reward: number;
  availableFrom: string;
  actionUrl: string;
  actionLabel: string;
  taskKind: TaskKind;
  status: TaskStatus;
  requiredProvider?: ProviderType | null;
}

export interface TaskCategory {
  id: number;
  slug: string;
  title: string;
  description: string;
  tasks: OneTimeTask[];
}

export interface TaskCategoriesResponse {
  categories: TaskCategory[];
}

export interface OneTimeTaskStartResponse {
  actionType: 'external_link' | 'redirect' | 'internal_link';
  url?: string;
  expiresAt?: string;
}

export interface OneTimeTaskVerifyResponse {
  status: 'completed' | 'already_completed' | 'failed_check';
  code: string;
  balance: number;
}

export interface AccountConnectionStatus {
  provider: ProviderType;
  taskSlug: string;
  isLinked: boolean;
  label: string;
  username: string;
  linkedAt?: string | null;
}

export interface AccountConnectionsResponse {
  connections: AccountConnectionStatus[];
}
