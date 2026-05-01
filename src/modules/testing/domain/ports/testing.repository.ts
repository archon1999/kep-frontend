import { Question } from '../entities/question.entity.ts';
import { TestPass } from '../entities/test-pass.entity.ts';
import { Test } from '../entities/test.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface TestResultRow {
  username: string;
  finished?: string;
  result?: number;
}

export interface StartTestResponse {
  success: boolean;
  testPassId?: number;
}

export interface FinishTestResponse {
  success: boolean;
  result?: number;
}

export interface TestingRepository {
  listTests: (params?: { page?: number; pageSize?: number }) => Promise<PageResult<Test>>;
  getTest: (testId: string) => Promise<Test>;
  getTestPass: (testPassId: string) => Promise<TestPass>;
  getBestResults: (testId: string) => Promise<TestResultRow[]>;
  getLastResults: (testId: string) => Promise<TestResultRow[]>;
  startTest: (testId: number) => Promise<StartTestResponse>;
  submitAnswer: (testPassId: number, questionNumber: number, answer: unknown) => Promise<void>;
  finishTest: (testPassId: number) => Promise<FinishTestResponse>;
  hydrateQuestion: (question: Question) => Question;
}
