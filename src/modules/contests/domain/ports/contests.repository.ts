import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
  ApiContestsRegistrantsListOrdering,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem } from '../entities/contest.entity';
import { ContestDetail } from '../entities/contest-detail.entity';
import { ContestProblemEntity } from '../entities/contest-problem.entity';
import { ContestQuestion } from '../entities/contest-question.entity';
import { ContestRatingRow } from '../entities/contest-rating.entity';
import {
  ContestRatingChange,
  ContestUserStatistics,
} from '../entities/contest-user-statistics.entity';
import { ContestStatistics } from '../entities/contest-statistics.entity';
import { ContestantEntity, ContestFilter } from '../entities/contestant.entity';
import { ContestRegistrant } from '../entities/contest-registrant.entity';
import { ContestTopContestant } from '../entities/contest.entity';

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
  filters: (contestId: number | string) => Promise<ContestFilter[]>;
  contestants: (contestId: number | string) => Promise<ContestantEntity[]>;
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
  submitSolution: (
    contestId: number | string,
    payload: { contestProblem: string; sourceCode: string; lang: string },
  ) => Promise<void>;
  register: (contestId: number | string, teamId?: number) => Promise<ContestDetail>;
  cancelRegistration: (contestId: number | string) => Promise<ContestDetail>;
}

export interface ContestStandingsParams {
  page?: number;
  pageSize?: number;
  filter?: number | string | null;
  following?: boolean;
}

export interface ContestRegistrantsParams {
  page?: number;
  pageSize?: number;
  ordering?: ApiContestsRegistrantsListOrdering;
}
