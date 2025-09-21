import { Question } from '@testing/domain';

export type TestPassQuestion = Question & {
  body?: string;
  audio?: string;
};
