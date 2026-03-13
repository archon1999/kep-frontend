import useSWR, { SWRConfiguration } from 'swr';
import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpContestsRepository } from '../data-access/repository/http.contests.repository';
import { ContestCategoryEntity, ContestListItem, ContestTopContestant } from '../domain/entities/contest.entity';
import { ContestRatingRow } from '../domain/entities/contest-rating.entity';
import {
  ContestRatingChange,
  ContestUserStatistics,
} from '../domain/entities/contest-user-statistics.entity';
import {
  ContestRegistrantsParams,
  ContestStandingsParams,
  PageResult,
} from '../domain/ports/contests.repository';
import { ContestDetail } from '../domain/entities/contest-detail.entity';
import { ContestProblemEntity } from '../domain/entities/contest-problem.entity';
import { ContestantEntity, ContestFilter } from '../domain/entities/contestant.entity';
import { ContestRegistrant } from '../domain/entities/contest-registrant.entity';
import { ContestQuestion } from '../domain/entities/contest-question.entity';
import { ContestStatistics } from '../domain/entities/contest-statistics.entity';

const contestsRepository = new HttpContestsRepository();

const listKey = (params?: ApiContestsListParams) => [
  'contests-list',
  params?.page,
  params?.pageSize,
  params?.title,
  params?.category,
  params?.type,
  params?.is_participated,
  params?.is_rated,
];

export const useContestsList = (params?: ApiContestsListParams) =>
  useSWR<PageResult<ContestListItem>>(listKey(params), () => contestsRepository.list(params));

export const useContestCategories = () =>
  useSWR<ContestCategoryEntity[]>('contests-categories', () => contestsRepository.categories());

export const useContestsRating = (params?: ApiContestsRatingListParams) =>
  useSWR<PageResult<ContestRatingRow>>(
    ['contests-rating', params?.page, params?.pageSize, params?.ordering],
    () => contestsRepository.rating(params),
  );

export const useContestUserStatistics = (username?: string) =>
  useSWR<ContestUserStatistics | null>(
    username ? ['contest-user-statistics', username] : null,
    () => contestsRepository.userStatistics(username!),
  );

export const useContestRatingChanges = (username?: string) =>
  useSWR<ContestRatingChange[]>(
    username ? ['contest-rating-changes', username] : null,
    () => contestsRepository.ratingChanges(username!),
  );

export const useContestTopContestants = (contestId?: number | string, enabled = true) =>
  useSWR<ContestTopContestant[]>(
    contestId && enabled ? ['contest-top3', contestId] : null,
    () => contestsRepository.top3Contestants(contestId!),
  );

export const useContest = (contestId?: number | string, options?: SWRConfiguration) =>
  useSWR<ContestDetail>(
    contestId ? ['contest', contestId] : null,
    () => contestsRepository.getById(contestId!),
    options,
  );

export const useContestProblems = (
  contestId?: number | string,
  options?: SWRConfiguration,
) =>
  useSWR<ContestProblemEntity[]>(
    contestId ? ['contest-problems', contestId] : null,
    () => contestsRepository.getProblems(contestId!),
    options,
  );

export const useContestProblem = (contestId?: number | string, symbol?: string) =>
  useSWR<ContestProblemEntity>(
    contestId && symbol ? ['contest-problem', contestId, symbol] : null,
    () => contestsRepository.getProblem(contestId!, symbol!),
  );

export const useContestContestant = (contestId?: number | string, options?: SWRConfiguration) =>
  useSWR<ContestantEntity | null>(
    contestId ? ['contest-contestant', contestId] : null,
    () => contestsRepository.getContestant(contestId!),
    options,
  );

export const useContestFilters = (contestId?: number | string) =>
  useSWR<ContestFilter[]>(
    contestId ? ['contest-filters', contestId] : null,
    () => contestsRepository.filters(contestId!),
  );

export const useContestStandings = (
  contestId?: number | string,
  params?: ContestStandingsParams,
  refreshInterval?: number,
) =>
  useSWR<PageResult<ContestantEntity>>(
    contestId
      ? [
          'contest-standings',
          contestId,
          params?.page,
          params?.pageSize,
          params?.filter,
          params?.following,
        ]
      : null,
    () => contestsRepository.standings(contestId!, params),
    refreshInterval ? { refreshInterval } : undefined,
  );

export const useContestRegistrants = (
  contestId?: number | string,
  params?: ContestRegistrantsParams,
) =>
  useSWR<PageResult<ContestRegistrant>>(
    contestId ? ['contest-registrants', contestId, params?.page, params?.pageSize, params?.ordering] : null,
    () => contestsRepository.registrants(contestId!, params),
  );

export const useContestQuestions = (contestId?: number | string) =>
  useSWR<ContestQuestion[]>(contestId ? ['contest-questions', contestId] : null, () =>
    contestsRepository.questions(contestId!),
  );

export const useContestStatistics = (contestId?: number | string) =>
  useSWR<ContestStatistics>(contestId ? ['contest-statistics', contestId] : null, () =>
    contestsRepository.statistics(contestId!),
  );

export const useContestContestants = (contestId?: number | string) =>
  useSWR<ContestantEntity[]>(contestId ? ['contest-contestants', contestId] : null, () =>
    contestsRepository.contestants(contestId!),
  );

export const contestsQueries = {
  contestsRepository,
};
