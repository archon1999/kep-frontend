import {
  ApiAttemptsListParams,
  ApiProblemsListParams,
  ApiProblemsRatingHistoryListParams,
  ApiProblemsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  mapAttemptDetail,
  mapAttempts,
  mapCategories,
  mapContestPreview,
  mapDifficultyBreakdown,
  mapHackAttemptsPage,
  mapLanguages,
  mapPeriodRating,
  mapProblemDetail,
  mapProblemSolution,
  mapProblemStatistics,
  mapProblemTag,
  mapProblemsUserStatistics,
  mapProblemVoteResult,
  mapProblemsRatingHistoryPage,
  mapProblemsRatingPage,
  mapProblemsPage,
  mapRatingSummary,
  mapAttemptsPage,
  mapVerdicts,
} from '../mappers/problems.mapper.ts';
import { problemsApiClient } from '../api/problems.client.ts';
import {
  AttemptDetail,
  AttemptListItem,
  HackAttempt,
  PeriodRatingEntry,
  ProblemDetail,
  ProblemListItem,
  ProblemSolution,
  ProblemStatistics,
  ProblemTag,
  ProblemTopic,
  ProblemVoteResult,
  ProblemsRatingHistoryEntry,
  ProblemsRatingRow,
  ProblemsRatingSummary,
  ProblemsUserStatistics,
} from '../../domain/entities/problem.entity.ts';
import {
  AttemptsListParams,
  HackAttemptsListParams,
  PageResult,
  ProblemsListParams,
  ProblemsRatingHistoryParams,
  ProblemsRatingParams,
  ProblemsRepository,
  ProblemsStatisticsParams,
} from '../../domain/ports/problems.repository.ts';

const mapFilterToApiParams = (params: ProblemsListParams): ApiProblemsListParams => {
  const { tags, status, favorites, search, ...rest } = params;
  const apiParams: ApiProblemsListParams = {
    ...rest,
  };

  if (status === 1) {
    apiParams.has_solved = '1';
  } else if (status === 2) {
    apiParams.has_solved = '0';
    apiParams.has_attempted = '1';
  } else if (status === 3) {
    apiParams.has_solved = '0';
    apiParams.has_attempted = '0';
  }

  if (tags?.length) {
    apiParams.tags = tags.join(',');
  }

  if (favorites) {
    apiParams.favorites = 'true';
  }

  if (search) {
    apiParams.search = search;
  }

  return apiParams;
};

export class HttpProblemsRepository implements ProblemsRepository {
  async getProblem(id: number): Promise<ProblemDetail> {
    const response = await problemsApiClient.getProblem(id);
    return mapProblemDetail(response);
  }

  async getProblemNext(id: number): Promise<number | null> {
    const response = await problemsApiClient.getProblemNext(id);
    return this.extractProblemId(response);
  }

  async getProblemPrev(id: number): Promise<number | null> {
    const response = await problemsApiClient.getProblemPrev(id);
    return this.extractProblemId(response);
  }

  async likeProblem(id: number): Promise<ProblemVoteResult> {
    const response = await problemsApiClient.likeProblem(id);
    return mapProblemVoteResult(response);
  }

  async dislikeProblem(id: number): Promise<ProblemVoteResult> {
    const response = await problemsApiClient.dislikeProblem(id);
    return mapProblemVoteResult(response);
  }

  async addFavorite(id: number): Promise<ProblemVoteResult> {
    const response = await problemsApiClient.addFavorite(id);
    return mapProblemVoteResult(response);
  }

  async removeFavorite(id: number): Promise<void> {
    await problemsApiClient.removeFavorite(id);
  }

  async listTags(): Promise<ProblemTag[]> {
    const response = await problemsApiClient.listTags();
    const data = Array.isArray((response as any)?.data) ? (response as any).data : response;
    return (data ?? []).map((tag: any) => mapProblemTag(tag));
  }

  async listTopics(): Promise<ProblemTopic[]> {
    const response = await problemsApiClient.listTopics();
    const data = Array.isArray((response as any)?.data) ? (response as any).data : response ?? [];
    return data.map((topic: any) => ({
      id: Number(topic?.id ?? 0),
      name: topic?.name ?? '',
    }));
  }

  async addTag(problemId: number, tagId: number): Promise<void> {
    await problemsApiClient.addTag(problemId, tagId);
  }

  async removeTag(problemId: number, tagId: number): Promise<void> {
    await problemsApiClient.removeTag(problemId, tagId);
  }

  async addTopic(problemId: number, topicId: number): Promise<void> {
    await problemsApiClient.addTopic(problemId, topicId);
  }

  async removeTopic(problemId: number, topicId: number): Promise<void> {
    await problemsApiClient.removeTopic(problemId, topicId);
  }

  async getProblemSolution(problemId: number): Promise<ProblemSolution> {
    const response = await problemsApiClient.getSolution(problemId);
    return mapProblemSolution(response);
  }

  async purchaseSolution(problemId: number): Promise<void> {
    await problemsApiClient.purchaseSolution(problemId);
  }

  async purchaseCheckSamples(problemId: number): Promise<void> {
    await problemsApiClient.purchaseCheckSamples(problemId);
  }

  async getProblemStatistics(problemId: number): Promise<ProblemStatistics> {
    const response = await problemsApiClient.getStatistics(problemId);
    return mapProblemStatistics(response);
  }

  async saveCheckInput(problemId: number, source: string): Promise<void> {
    await problemsApiClient.saveCheckInput(problemId, { source });
  }

  async submitSolution(
    problemId: number,
    payload: { sourceCode: string; lang: string; [key: string]: unknown },
  ): Promise<void> {
    await problemsApiClient.submit(problemId, payload);
  }

  async runCustomTest(payload: { sourceCode: string; lang: string; inputData: string }) {
    const response = await problemsApiClient.customTest(payload);
    return { id: (response as any)?.id };
  }

  async answerForInput(problemId: number, payload: { input_data: string; sourceCode?: string; lang?: string }) {
    const response = await problemsApiClient.answerForInput(problemId, payload);
    return { id: (response as any)?.id };
  }

  async checkSampleTests(problemId: number, payload: { sourceCode: string; lang: string }) {
    const response = await problemsApiClient.checkSampleTests(problemId, payload);
    return { id: (response as any)?.id };
  }

  async list(params: ProblemsListParams): Promise<PageResult<ProblemListItem>> {
    const page = await problemsApiClient.list(mapFilterToApiParams(params));
    return mapProblemsPage(page);
  }

  async listLanguages() {
    const response = await problemsApiClient.listLanguages();
    return mapLanguages(response);
  }

  async listCategories() {
    const categories = await problemsApiClient.listCategories();
    return mapCategories(categories);
  }

  async listMostViewed() {
    const response = await problemsApiClient.listMostViewed();
    return mapProblemsPage(response).data;
  }

  async getLastContest() {
    const response = await problemsApiClient.getLastContest();
    return mapContestPreview(response);
  }

  async listUserAttempts(username: string, pageSize = 10) {
    const response = await problemsApiClient.listUserAttempts({ username, pageSize });
    return mapAttempts(response);
  }

  async getUserRating(username: string): Promise<ProblemsRatingSummary | null> {
    const response = await problemsApiClient.getUserRating(username);
    const difficulties = this.mapDifficulties(response);
    return mapRatingSummary(response, difficulties);
  }

  async getUserStatistics(
    username: string,
    params?: ProblemsStatisticsParams,
  ): Promise<ProblemsUserStatistics> {
    const response = await problemsApiClient.getUserStatistics(username, params);
    return mapProblemsUserStatistics(response);
  }

  async listRating(params: ProblemsRatingParams): Promise<PageResult<ProblemsRatingRow>> {
    const response = await problemsApiClient.listRating(mapRatingFilter(params));
    return mapProblemsRatingPage(response);
  }

  async listPeriodRating(period: 'today' | 'week' | 'month'): Promise<PeriodRatingEntry[]> {
    const response = await problemsApiClient.listPeriodRating(period);
    return mapPeriodRating(response);
  }

  async listRatingHistory(
    params: ProblemsRatingHistoryParams,
  ): Promise<PageResult<ProblemsRatingHistoryEntry>> {
    const response = await problemsApiClient.listRatingHistory(mapRatingHistoryFilter(params));
    return mapProblemsRatingHistoryPage(response);
  }

  async listAttempts(params: AttemptsListParams): Promise<PageResult<AttemptListItem>> {
    const response = await problemsApiClient.listAttempts(mapAttemptsFilter(params));
    return mapAttemptsPage(response);
  }

  async getAttempt(attemptId: number): Promise<AttemptDetail> {
    const response = await problemsApiClient.getAttempt(attemptId);
    return mapAttemptDetail(response);
  }

  async purchaseAttempt(attemptId: number): Promise<void> {
    await problemsApiClient.purchaseAttempt(attemptId);
  }

  async purchaseAttemptTest(attemptId: number): Promise<void> {
    await problemsApiClient.purchaseAttemptTest(attemptId);
  }

  async listVerdicts() {
    const response = await problemsApiClient.listVerdicts();
    return mapVerdicts(response);
  }

  async rerunAttempt(attemptId: number): Promise<void> {
    await problemsApiClient.rerunAttempt(attemptId);
  }

  async listHackAttempts(params: HackAttemptsListParams): Promise<PageResult<HackAttempt>> {
    const response = await problemsApiClient.listHackAttempts(mapHackAttemptsFilter(params));
    return mapHackAttemptsPage(response);
  }

  async rerunHackAttempt(hackAttemptId: number): Promise<void> {
    await problemsApiClient.rerunHackAttempt(hackAttemptId);
  }

  mapDifficulties(stats: unknown) {
    return mapDifficultyBreakdown(stats);
  }

  private extractProblemId(payload: any): number | null {
    const value = payload?.id ?? payload?.problemId ?? payload?.problem_id;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed === 0) {
      return null;
    }
    return parsed;
  }
}

const mapRatingFilter = (params: ProblemsRatingParams): ApiProblemsRatingListParams => ({
  ordering: params.ordering,
  page: params.page,
  pageSize: params.pageSize,
});

const mapRatingHistoryFilter = (
  params: ProblemsRatingHistoryParams,
): ApiProblemsRatingHistoryListParams => ({
  ordering: params.ordering,
  type: params.type !== undefined ? String(params.type) : undefined,
  page: params.page,
  pageSize: params.pageSize,
});

const mapAttemptsFilter = (params: AttemptsListParams): ApiAttemptsListParams => ({
  ordering: params.ordering,
  username: params.username || undefined,
  problem_id: params.problemId !== undefined ? String(params.problemId) : undefined,
  contest_id: params.contestId !== undefined ? String(params.contestId) : undefined,
  duel_id: params.duelId !== undefined ? String(params.duelId) : undefined,
  contest_problem: params.contestProblem,
  duel_problem: params.duelProblem,
  verdict: params.verdict !== undefined ? String(params.verdict) : undefined,
  lang: params.lang || undefined,
  page: params.page,
  pageSize: params.pageSize,
});

const mapHackAttemptsFilter = (params: HackAttemptsListParams) => ({
  problem_id: params.problemId !== undefined ? String(params.problemId) : undefined,
  page: params.page,
  pageSize: params.pageSize,
});
