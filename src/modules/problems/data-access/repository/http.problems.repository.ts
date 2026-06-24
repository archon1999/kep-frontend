import {
  ApiAttemptsListParams,
  ApiProblemsListParams,
  ApiProblemsRatingHistoryListParams,
  ApiProblemsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  AttemptDetail,
  AttemptListItem,
  PeriodRatingEntry,
  ProblemDetail,
  ProblemGroup,
  ProblemListItem,
  ProblemSolution,
  ProblemSolver,
  ProblemStatistics,
  ProblemTag,
  ProblemTopic,
  ProblemVoteResult,
  ProblemsRatingHistoryEntry,
  ProblemsRatingRow,
  ProblemsRatingSummary,
  ProblemsUserStatistics,
  ProblemsUserStatisticsActivity,
  ProblemsUserStatisticsHeatmap,
  RecommendationResolveResponse,
  StudyPlanDetail,
  StudyPlanListItem,
} from '../../domain/entities/problem.entity.ts';
import {
  AttemptsListParams,
  PageResult,
  ProblemSolversParams,
  ProblemsListParams,
  ProblemsRatingHistoryParams,
  ProblemsRatingParams,
  ProblemsRepository,
  ProblemsStatisticsParams,
  RecommendationResolveParams,
} from '../../domain/ports/problems.repository.ts';
import { problemsApiClient } from '../api/problems.client.ts';
import {
  mapAttemptDetail,
  mapAttempts,
  mapAttemptsPage,
  mapCategories,
  mapContestPreview,
  mapDifficultyBreakdown,
  mapLanguages,
  mapPeriodRating,
  mapProblemDetail,
  mapProblemGroups,
  mapProblemSolution,
  mapProblemSolversPage,
  mapProblemStatistics,
  mapProblemTag,
  mapProblemVoteResult,
  mapProblemsPage,
  mapProblemsRatingHistoryPage,
  mapProblemsRatingPage,
  mapProblemsUserStatistics,
  mapProblemsUserStatisticsActivity,
  mapProblemsUserStatisticsHeatmap,
  mapRatingSummary,
  mapRecommendationResolveResponse,
  mapStudyPlanDetail,
  mapStudyPlanListItem,
  mapVerdicts,
} from '../mappers/problems.mapper.ts';

const mapFilterToApiParams = (params: ProblemsListParams): ApiProblemsListParams => {
  const { groups, tags, status, favorites, search, ...rest } = params;
  const apiParams = {
    ...(rest as Record<string, unknown>),
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

  if (groups?.length) {
    apiParams.groups = groups.join(',');
  }

  if (favorites) {
    apiParams.favorites = 'true';
  }

  if (search) {
    apiParams.search = search;
  }

  return apiParams as ApiProblemsListParams;
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

  async listStudyPlans(): Promise<StudyPlanListItem[]> {
    const response = await problemsApiClient.listStudyPlans();
    const data = Array.isArray((response as any)?.data) ? (response as any).data : response;
    return (data ?? []).map((item: any) => mapStudyPlanListItem(item));
  }

  async getStudyPlan(id: number): Promise<StudyPlanDetail> {
    const response = await problemsApiClient.getStudyPlan(id);
    return mapStudyPlanDetail(response);
  }

  async purchaseStudyPlan(id: number): Promise<void> {
    await problemsApiClient.purchaseStudyPlan(id);
  }

  async resolveRecommendation(
    payload: RecommendationResolveParams,
  ): Promise<RecommendationResolveResponse> {
    const response = await problemsApiClient.resolveRecommendation(payload);
    return mapRecommendationResolveResponse(response);
  }

  async listTags(): Promise<ProblemTag[]> {
    const response = await problemsApiClient.listTags();
    const data = Array.isArray((response as any)?.data) ? (response as any).data : response;
    return (data ?? []).map((tag: any) => mapProblemTag(tag));
  }

  async listTopics(): Promise<ProblemTopic[]> {
    const response = await problemsApiClient.listTopics();
    const data = Array.isArray((response as any)?.data) ? (response as any).data : (response ?? []);
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

  async listProblemSolvers(
    problemId: number,
    params?: ProblemSolversParams,
  ): Promise<PageResult<ProblemSolver>> {
    const response = await problemsApiClient.listSolvers(problemId, params);
    return mapProblemSolversPage(response);
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

  async runCustomTest(payload: {
    problemId?: number | string;
    sourceCode: string;
    lang: string;
    inputData: string;
  }) {
    const response = await problemsApiClient.customTest(payload);
    return { id: (response as any)?.id };
  }

  async answerForInput(
    problemId: number,
    payload: { input_data: string; sourceCode?: string; lang?: string },
  ) {
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

  async listGroups(): Promise<ProblemGroup[]> {
    const response = await problemsApiClient.listGroups();
    return mapProblemGroups(response);
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

  async getUserStatisticsActivity(
    username: string,
    params?: Pick<ProblemsStatisticsParams, 'days'>,
  ): Promise<ProblemsUserStatisticsActivity> {
    const response = await problemsApiClient.getUserStatisticsActivity(username, params);
    return mapProblemsUserStatisticsActivity(response);
  }

  async getUserStatisticsHeatmap(
    username: string,
    params?: Pick<ProblemsStatisticsParams, 'year'>,
  ): Promise<ProblemsUserStatisticsHeatmap> {
    const response = await problemsApiClient.getUserStatisticsHeatmap(username, params);
    return mapProblemsUserStatisticsHeatmap(response);
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
  test_case_number: params.testCaseNumber !== undefined ? String(params.testCaseNumber) : undefined,
  test_case_number_operator: params.testCaseNumberOperator,
  page: params.page,
  pageSize: params.pageSize,
});
