import { Chapter } from 'modules/testing/domain/entities/chapter.entity.ts';
import { Question } from 'modules/testing/domain/entities/question.entity.ts';
import {
  Challenge,
  ChallengeCall,
  ChallengeRatingChange,
  ChallengeRatingRow,
} from '../index.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ChallengeAnswerPayload {
  answer: unknown;
  isFinish?: boolean;
}

export interface ChallengeStartResponse {
  success: boolean;
  challengeId?: number;
}

export interface ChallengeCheckResponse {
  success: boolean;
}

export interface ChallengesRepository {
  getChallengeCalls: () => Promise<ChallengeCall[]>;
  createChallengeCall: (payload: { timeSeconds: number; questionsCount: number; chapters?: number[] }) => Promise<void>;
  deleteChallengeCall: (id: number) => Promise<void>;
  acceptChallengeCall: (id: number) => Promise<ChallengeStartResponse>;
  listChallenges: (params?: { page?: number; pageSize?: number; username?: string; arenaId?: number }) => Promise<PageResult<Challenge>>;
  getChallenge: (challengeId: number | string) => Promise<Challenge>;
  startChallenge: (challengeId: number) => Promise<void>;
  submitAnswer: (challengeId: number, payload: ChallengeAnswerPayload) => Promise<ChallengeCheckResponse>;
  listRating: (params?: { page?: number; pageSize?: number; ordering?: string }) => Promise<PageResult<ChallengeRatingRow>>;
  listRatingChanges: (username: string) => Promise<ChallengeRatingChange[]>;
  getUserRating: (username: string) => Promise<ChallengeRatingRow | null>;
  listUserChallenges: (params: { username: string; page?: number; pageSize?: number }) => Promise<PageResult<Challenge>>;
  listChapters: () => Promise<Chapter[]>;
  hydrateQuestion: (question: Question) => Question;
}
