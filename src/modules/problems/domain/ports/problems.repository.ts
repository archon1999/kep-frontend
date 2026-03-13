import { ApiProblemsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  AttemptFilterOption,
  AttemptDetail,
  AttemptListItem,
  DifficultyBreakdown,
  HackAttempt,
  PeriodRatingEntry,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemContestPreview,
  ProblemDetail,
  ProblemLanguageOption,
  ProblemListItem,
  ProblemSolution,
  ProblemStatistics,
  ProblemTag,
  ProblemTopic,
  ProblemVoteResult,
  ProblemsRatingRow,
  ProblemsRatingSummary,
  ProblemsRatingHistoryEntry,
  ProblemsUserStatistics,
} from '../entities/problem.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export type ProblemsListParams = Omit<ApiProblemsListParams, 'tags' | 'favorites'> & {
  status?: number;
  tags?: number[];
  search?: string;
  favorites?: boolean;
};

export type ProblemsRatingParams = {
  ordering?: string;
  page?: number;
  pageSize?: number;
};

export type ProblemsRatingHistoryParams = {
  ordering?: string;
  type?: number;
  page?: number;
  pageSize?: number;
};

export type AttemptsListParams = {
  ordering?: string;
  username?: string;
  problemId?: number;
  contestId?: number;
  duelId?: number;
  contestProblem?: string;
  duelProblem?: string;
  verdict?: number;
  lang?: string;
  page?: number;
  pageSize?: number;
};

export type ProblemsStatisticsParams = {
  year?: number;
  days?: number;
};

export type HackAttemptsListParams = {
  problemId?: number;
  page?: number;
  pageSize?: number;
};

export interface ProblemsRepository {
  getProblem(id: number): Promise<ProblemDetail>;
  getProblemNext(id: number): Promise<number | null>;
  getProblemPrev(id: number): Promise<number | null>;
  likeProblem(id: number): Promise<ProblemVoteResult>;
  dislikeProblem(id: number): Promise<ProblemVoteResult>;
  addFavorite(id: number): Promise<ProblemVoteResult>;
  removeFavorite(id: number): Promise<void>;
  listTags(): Promise<ProblemTag[]>;
  listTopics(): Promise<ProblemTopic[]>;
  addTag(problemId: number, tagId: number): Promise<void>;
  removeTag(problemId: number, tagId: number): Promise<void>;
  addTopic(problemId: number, topicId: number): Promise<void>;
  removeTopic(problemId: number, topicId: number): Promise<void>;
  getProblemSolution(problemId: number): Promise<ProblemSolution>;
  purchaseSolution(problemId: number): Promise<void>;
  purchaseCheckSamples(problemId: number): Promise<void>;
  getProblemStatistics(problemId: number): Promise<ProblemStatistics>;
  saveCheckInput(problemId: number, source: string): Promise<void>;
  submitSolution(
    problemId: number,
    payload: { sourceCode: string; lang: string; [key: string]: unknown },
  ): Promise<void>;
  runCustomTest(payload: { sourceCode: string; lang: string; inputData: string }): Promise<{ id?: number }>;
  answerForInput(
    problemId: number,
    payload: { input_data: string; sourceCode?: string; lang?: string },
  ): Promise<{ id?: number }>;
  checkSampleTests(problemId: number, payload: { sourceCode: string; lang: string }): Promise<{ id?: number }>;
  list(params: ProblemsListParams): Promise<PageResult<ProblemListItem>>;
  listLanguages(): Promise<ProblemLanguageOption[]>;
  listCategories(): Promise<ProblemCategory[]>;
  listMostViewed(): Promise<ProblemListItem[]>;
  getLastContest(): Promise<ProblemContestPreview | null>;
  listUserAttempts(username: string, pageSize?: number): Promise<ProblemAttemptSummary[]>;
  getUserRating(username: string): Promise<ProblemsRatingSummary | null>;
  listRating(params: ProblemsRatingParams): Promise<PageResult<ProblemsRatingRow>>;
  listPeriodRating(period: 'today' | 'week' | 'month'): Promise<PeriodRatingEntry[]>;
  listRatingHistory(params: ProblemsRatingHistoryParams): Promise<PageResult<ProblemsRatingHistoryEntry>>;
  listAttempts(params: AttemptsListParams): Promise<PageResult<AttemptListItem>>;
  getAttempt(attemptId: number): Promise<AttemptDetail>;
  purchaseAttempt(attemptId: number): Promise<void>;
  purchaseAttemptTest(attemptId: number): Promise<void>;
  listVerdicts(): Promise<AttemptFilterOption[]>;
  getUserStatistics(username: string, params?: ProblemsStatisticsParams): Promise<ProblemsUserStatistics>;
  rerunAttempt(attemptId: number): Promise<void>;
  listHackAttempts(params: HackAttemptsListParams): Promise<PageResult<HackAttempt>>;
  rerunHackAttempt(hackAttemptId: number): Promise<void>;
  mapDifficulties(stats: unknown): DifficultyBreakdown;
}
