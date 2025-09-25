export type UserActivityType =
  | 'problem_attempt_summary'
  | 'challenge_summary'
  | 'project_attempt_summary'
  | 'test_pass_summary'
  | 'contest_participation'
  | 'arena_participation'
  | 'daily_activity'
  | 'hard_problem_solved'
  | 'achievement_unlocked'
  | 'daily_task_completed';

export interface UserActivityHistoryUser {
  username: string;
  avatar: string;
}

export interface UserActivityHistoryItemBase<
  TType extends UserActivityType,
  TPayload
> {
  id: number;
  user: UserActivityHistoryUser;
  activityType: TType;
  activityTypeDisplay: string;
  recordedFor: string;
  createdAt: string;
  payload: TPayload;
}

export interface ProblemAttemptSummaryPayload {
  total: number;
  accepted: number;
}

export type ProblemAttemptSummaryActivity = UserActivityHistoryItemBase<
  'problem_attempt_summary',
  ProblemAttemptSummaryPayload
>;

export interface ChallengeSummaryPayload {
  wins: number;
  draws: number;
  losses: number;
}

export type ChallengeSummaryActivity = UserActivityHistoryItemBase<
  'challenge_summary',
  ChallengeSummaryPayload
>;

export interface ProjectAttemptSummaryPayload {
  total: number;
  checked: number;
}

export type ProjectAttemptSummaryActivity = UserActivityHistoryItemBase<
  'project_attempt_summary',
  ProjectAttemptSummaryPayload
>;

export interface TestPassSummaryPayload {
  total: number;
  solved: number;
  completed: number;
}

export type TestPassSummaryActivity = UserActivityHistoryItemBase<
  'test_pass_summary',
  TestPassSummaryPayload
>;

export interface ContestParticipationPayload {
  rank: number | null;
  bonus: number | null;
  delta: number | null;
  contestId: number;
  finishTime: string;
  ratingAfter: number | null;
  contestTitle: string;
  ratingBefore: number | null;
}

export type ContestParticipationActivity = UserActivityHistoryItemBase<
  'contest_participation',
  ContestParticipationPayload
>;

export interface ArenaParticipationPayload {
  rank: number | null;
  points: number | null;
  arenaId: number;
  arenaTitle: string;
  finishTime: string;
}

export type ArenaParticipationActivity = UserActivityHistoryItemBase<
  'arena_participation',
  ArenaParticipationPayload
>;

export interface DailyActivityPayload {
  note: string;
  value: number;
}

export type DailyActivityActivity = UserActivityHistoryItemBase<
  'daily_activity',
  DailyActivityPayload
>;

export interface HardProblemSolvedPayload {
  difficulty: string;
  problemId: number;
  problemTitle: string;
}

export type HardProblemSolvedActivity = UserActivityHistoryItemBase<
  'hard_problem_solved',
  HardProblemSolvedPayload
>;

export interface AchievementUnlockedPayload {
  message: string;
}

export type AchievementUnlockedActivity = UserActivityHistoryItemBase<
  'achievement_unlocked',
  AchievementUnlockedPayload
>;

export interface DailyTaskCompletedPayload {
  taskId: number;
  taskType: string;
  description: string;
  dailyTaskId: number;
}

export type DailyTaskCompletedActivity = UserActivityHistoryItemBase<
  'daily_task_completed',
  DailyTaskCompletedPayload
>;

export type UserActivityHistoryItem =
  | ProblemAttemptSummaryActivity
  | ChallengeSummaryActivity
  | ProjectAttemptSummaryActivity
  | TestPassSummaryActivity
  | ContestParticipationActivity
  | ArenaParticipationActivity
  | DailyActivityActivity
  | HardProblemSolvedActivity
  | AchievementUnlockedActivity
  | DailyTaskCompletedActivity;

