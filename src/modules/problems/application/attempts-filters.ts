import type { AttemptsListParams } from '../domain/contracts/problems.repository';

export interface AttemptsFilterState {
  username: string;
  problemId: string;
  verdict: string;
  lang: string;
  testCaseNumber: string;
  testCaseNumberOperator: 'lt' | 'exact' | 'gt';
}

export type ProblemOption = {
  id: number;
  title: string;
};

export type UserOption = {
  username: string;
  fullName: string;
  avatar?: string;
};

export const buildAttemptsListParams = (
  filter: AttemptsFilterState,
  pageParams: { page: number; pageSize: number },
): AttemptsListParams => {
  const problemId = filter.problemId.trim() ? Number(filter.problemId) : NaN;
  const verdict = filter.verdict.trim() ? Number(filter.verdict) : NaN;
  const testCaseNumber = filter.testCaseNumber.trim() ? Number(filter.testCaseNumber) : NaN;

  return {
    username: filter.username || undefined,
    problemId: Number.isNaN(problemId) ? undefined : problemId,
    verdict: Number.isNaN(verdict) ? undefined : verdict,
    lang: filter.lang || undefined,
    testCaseNumber: Number.isNaN(testCaseNumber) ? undefined : testCaseNumber,
    testCaseNumberOperator: Number.isNaN(testCaseNumber)
      ? undefined
      : filter.testCaseNumberOperator,
    page: pageParams.page,
    pageSize: pageParams.pageSize,
    ordering: '-id',
  };
};
