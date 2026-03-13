import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem } from '../../domain/entities/contest.entity';
import { ContestDetail } from '../../domain/entities/contest-detail.entity';
import { ContestProblemEntity } from '../../domain/entities/contest-problem.entity';
import { ContestQuestion } from '../../domain/entities/contest-question.entity';
import { ContestRatingRow } from '../../domain/entities/contest-rating.entity';
import { ContestStatistics } from '../../domain/entities/contest-statistics.entity';
import { ContestantEntity, ContestFilter } from '../../domain/entities/contestant.entity';
import { ContestRegistrant } from '../../domain/entities/contest-registrant.entity';
import {
  ContestRegistrantsParams,
  ContestStandingsParams,
  ContestsRepository,
  PageResult,
} from '../../domain/ports/contests.repository';
import { contestsApiClient } from '../api/contests.client';
import { mapContestDetail } from '../mappers/contest-detail.mapper';
import {
  mapCategory,
  mapContest,
  mapContestRating,
  mapContestTopContestant,
  mapPageResult,
} from '../mappers/contest.mapper';
import { mapContestProblem } from '../mappers/contest-problem.mapper';
import {
  mapContestRatingChange,
  mapContestStatistics,
  mapContestUserStatistics,
} from '../mappers/contest-statistics.mapper';
import {
  mapContestant,
  mapContestantList,
  mapContestantsPage,
  mapContestFilters,
  mapContestRegistrant,
} from '../mappers/contestant.mapper';
import { mapContestQuestions } from '../mappers/contest-questions.mapper';
import { sortContestProblems } from '../../utils/sortContestProblems';

export class HttpContestsRepository implements ContestsRepository {
  async list(params?: ApiContestsListParams): Promise<PageResult<ContestListItem>> {
    const result = await contestsApiClient.list(params);
    return mapPageResult(result, mapContest);
  }

  async categories(): Promise<ContestCategoryEntity[]> {
    const result = await contestsApiClient.categories();
    return result.map(mapCategory);
  }

  async getById(contestId: number | string): Promise<ContestDetail> {
    const result = await contestsApiClient.getById(contestId);
    return mapContestDetail(result);
  }

  async getContestant(contestId: number | string): Promise<ContestantEntity | null> {
    const result = await contestsApiClient.getMe(contestId);
    if (!result) return null;
    return mapContestant(result);
  }

  async getProblems(contestId: number | string): Promise<ContestProblemEntity[]> {
    const result = await contestsApiClient.getProblems(contestId);
    const problems = Array.isArray(result) ? result.map(mapContestProblem) : [];
    return sortContestProblems(problems);
  }

  async getProblem(contestId: number | string, symbol: string): Promise<ContestProblemEntity> {
    const result = await contestsApiClient.getProblem(contestId, symbol);
    return mapContestProblem(result);
  }

  async rating(params?: ApiContestsRatingListParams): Promise<PageResult<ContestRatingRow>> {
    const result = await contestsApiClient.rating(params);
    return mapPageResult(result, mapContestRating);
  }

  async userStatistics(username: string) {
    const result = await contestsApiClient.userStatistics(username);
    if (!result) return null;
    return mapContestUserStatistics(result);
  }

  async ratingChanges(username: string) {
    const result = await contestsApiClient.ratingChanges(username);
    return Array.isArray(result) ? result.map(mapContestRatingChange) : [];
  }

  async top3Contestants(contestId: number | string) {
    const result = await contestsApiClient.top3Contestants(contestId);
    const contestants = Array.isArray(result) ? result : (result as any)?.contestants ?? [];
    return contestants.map(mapContestTopContestant);
  }

  async standings(
    contestId: number | string,
    params?: ContestStandingsParams,
  ): Promise<PageResult<ContestantEntity>> {
    const result = await contestsApiClient.getStandings(contestId, {
      page: params?.page,
      pageSize: params?.pageSize,
      filter: params?.filter !== null ? params?.filter?.toString() : undefined,
      following: params?.following ? 'true' : undefined,
    });
    return mapContestantsPage(result);
  }

  async filters(contestId: number | string): Promise<ContestFilter[]> {
    const result = await contestsApiClient.getFilters(contestId);
    return mapContestFilters(result);
  }

  async contestants(contestId: number | string): Promise<ContestantEntity[]> {
    const result = await contestsApiClient.getContestants(contestId);
    const contestants = Array.isArray(result) ? result : (result as any)?.contestants ?? [];
    return mapContestantList(contestants);
  }

  async registrants(
    contestId: number | string,
    params?: ContestRegistrantsParams,
  ): Promise<PageResult<ContestRegistrant>> {
    const result = await contestsApiClient.getRegistrants(contestId, {
      page: params?.page,
      pageSize: params?.pageSize,
      ordering: params?.ordering,
    });
    return mapPageResult(result, (item, index, page, pageSize) =>
      mapContestRegistrant(item, index, page, pageSize),
    );
  }

  async questions(contestId: number | string): Promise<ContestQuestion[]> {
    const result = await contestsApiClient.getQuestions(contestId);
    return mapContestQuestions(result);
  }

  async submitQuestion(
    contestId: number | string,
    payload: { problem?: string | null; question: string },
  ): Promise<void> {
    await contestsApiClient.submitQuestion(contestId, payload);
  }

  async statistics(contestId: number | string): Promise<ContestStatistics> {
    const result = await contestsApiClient.getStatistics(contestId);
    return mapContestStatistics(result);
  }

  async submitSolution(
    contestId: number | string,
    payload: { contestProblem: string; sourceCode: string; lang: string },
  ): Promise<void> {
    await contestsApiClient.submitSolution(contestId, payload);
  }

  async register(contestId: number | string, teamId?: number): Promise<ContestDetail> {
    const result = await contestsApiClient.register(contestId, teamId ? { team_id: teamId } : {});
    return mapContestDetail(result);
  }

  async cancelRegistration(contestId: number | string): Promise<ContestDetail> {
    const result = await contestsApiClient.cancelRegistration(contestId);
    return mapContestDetail(result);
  }
}
