export type UserActivityHistoryType =
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

interface BaseUserActivityHistoryItem {
  id: number;
  user: UserActivityHistoryUser;
  activityTypeDisplay: string;
  recordedFor: string;
  createdAt: string;
}

export type ProblemAttemptSummaryActivity = BaseUserActivityHistoryItem & {
  activityType: 'problem_attempt_summary';
  payload: {
    total: number;
    accepted: number;
  };
};

export type ChallengeSummaryActivity = BaseUserActivityHistoryItem & {
  activityType: 'challenge_summary';
  payload: {
    wins: number;
    draws: number;
    losses: number;
  };
};

export type ProjectAttemptSummaryActivity = BaseUserActivityHistoryItem & {
  activityType: 'project_attempt_summary';
  payload: {
    total: number;
    checked: number;
  };
};

export type TestPassSummaryActivity = BaseUserActivityHistoryItem & {
  activityType: 'test_pass_summary';
  payload: {
    total: number;
    solved: number;
    completed: number;
  };
};

export type ContestParticipationActivity = BaseUserActivityHistoryItem & {
  activityType: 'contest_participation';
  payload: {
    rank: number | null;
    bonus: number | null;
    delta: number | null;
    contestId: number;
    finishTime: string | null;
    ratingAfter: number | null;
    contestTitle: string;
    ratingBefore: number | null;
  };
};

export type ArenaParticipationActivity = BaseUserActivityHistoryItem & {
  activityType: 'arena_participation';
  payload: {
    rank: number | null;
    points: number | null;
    arenaId: number;
    arenaTitle: string;
    finishTime: string | null;
  };
};

export type DailyActivityActivity = BaseUserActivityHistoryItem & {
  activityType: 'daily_activity';
  payload: {
    note: string;
    value: number;
  };
};

export type HardProblemSolvedActivity = BaseUserActivityHistoryItem & {
  activityType: 'hard_problem_solved';
  payload: {
    difficulty: string;
    problemId: number;
    problemTitle: string;
  };
};

export type AchievementUnlockedActivity = BaseUserActivityHistoryItem & {
  activityType: 'achievement_unlocked';
  payload: {
    message: string;
  };
};

export type DailyTaskCompletedActivity = BaseUserActivityHistoryItem & {
  activityType: 'daily_task_completed';
  payload: {
    taskId: number;
    taskType: string;
    description: string;
    dailyTaskId: number;
  };
};

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
