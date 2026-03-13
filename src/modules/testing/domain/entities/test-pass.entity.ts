import { Test } from './test.entity.ts';

export interface TestPass {
  id: number;
  started: string;
  test: Test;
}
