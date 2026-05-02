import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
  ApiContestsRegistrantsListOrdering,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestDetail } from '../entities/contest-detail.entity';
import { ContestProblemEntity } from '../entities/contest-problem.entity';
import { ContestQuestion } from '../entities/contest-question.entity';
import { ContestRatingRow } from '../entities/contest-rating.entity';
import { ContestRegistrant } from '../entities/contest-registrant.entity';
import { ContestStatistics, ContestStatisticsGeneral } from '../entities/contest-statistics.entity';
import {
  ContestRatingChange,
  ContestUserStatistics,
} from '../entities/contest-user-statistics.entity';
import { ContestCategoryEntity, ContestListItem } from '../entities/contest.entity';
import { ContestTopContestant } from '../entities/contest.entity';
import { ContestFilter, ContestantEntity, ContestantTimeline } from '../entities/contestant.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ContestsRepository {
  list: (params?: ApiContestsListParams) => Promise<PageResult<ContestListItem>>;
  categories: () => Promise<ContestCategoryEntity[]>;
  getById: (contestId: number | string) => Promise<ContestDetail>;
  getContestant: (contestId: number | string) => Promise<ContestantEntity | null>;
  getProblems: (contestId: number | string) => Promise<ContestProblemEntity[]>;
  getProblem: (contestId: number | string, symbol: string) => Promise<ContestProblemEntity>;
  rating: (params?: ApiContestsRatingListParams) => Promise<PageResult<ContestRatingRow>>;
  userStatistics: (username: string) => Promise<ContestUserStatistics | null>;
  ratingChanges: (username: string) => Promise<ContestRatingChange[]>;
  top3Contestants: (contestId: number | string) => Promise<ContestTopContestant[]>;
  standings: (
    contestId: number | string,
    params?: ContestStandingsParams,
  ) => Promise<PageResult<ContestantEntity>>;
  contestantTimeline: (
    contestId: number | string,
    contestantId: number | string,
  ) => Promise<ContestantTimeline>;
  filters: (contestId: number | string) => Promise<ContestFilter[]>;
  contestants: (
    contestId: number | string,
    params?: ContestContestantsParams,
  ) => Promise<ContestantEntity[]>;
  registrants: (
    contestId: number | string,
    params?: ContestRegistrantsParams,
  ) => Promise<PageResult<ContestRegistrant>>;
  questions: (contestId: number | string) => Promise<ContestQuestion[]>;
  submitQuestion: (
    contestId: number | string,
    payload: { problem?: string | null; question: string },
  ) => Promise<void>;
  statistics: (contestId: number | string) => Promise<ContestStatistics>;
  statisticsSummary: (contestId: number | string) => Promise<ContestStatisticsGeneral>;
  submitSolution: (
    contestId: number | string,
    payload: { contestProblem: string; sourceCode: string; lang: string },
  ) => Promise<void>;
  purchaseVirtualContest: (contestId: number | string) => Promise<void>;
  startVirtualContest: (contestId: number | string) => Promise<void>;
  register: (contestId: number | string, teamId?: number) => Promise<ContestDetail>;
  cancelRegistration: (contestId: number | string) => Promise<ContestDetail>;
}

export interface ContestStandingsParams {
  page?: number;
  pageSize?: number;
  filter?: number | string | null;
  following?: boolean;
  official?: boolean;
}

export interface ContestContestantsParams {
  ordering?: 'rank' | '-rank' | 'delta' | '-delta';
}

export interface ContestRegistrantsParams {
  page?: number;
  pageSize?: number;
  ordering?: ApiContestsRegistrantsListOrdering;
}
