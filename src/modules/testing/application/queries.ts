import useSWR from 'swr';
import { HttpTestingRepository } from '../data-access/repository/http.testing.repository.ts';
import { PageResult, TestResultRow } from '../domain/ports/testing.repository.ts';
import { Test, TestPass } from '../domain';

const testingRepository = new HttpTestingRepository();

export const useTestsList = (params?: { page?: number; pageSize?: number }) =>
  useSWR<PageResult<Test>>(['tests-list', params?.page, params?.pageSize], () =>
    testingRepository.listTests(params),
  );

export const useTestDetail = (testId?: string) =>
  useSWR<Test>(testId ? ['test-detail', testId] : null, () => testingRepository.getTest(testId!));

export const useTestPass = (testPassId?: string) =>
  useSWR<TestPass>(testPassId ? ['test-pass', testPassId] : null, () => testingRepository.getTestPass(testPassId!));

export const useTestResults = (testId?: string) =>
  useSWR<{ bestResults: TestResultRow[]; lastResults: TestResultRow[] }>(
    testId ? ['test-results', testId] : null,
    async () => {
      const [bestResults, lastResults] = await Promise.all([
        testingRepository.getBestResults(testId!),
        testingRepository.getLastResults(testId!),
      ]);

      return { bestResults, lastResults };
    },
  );

export const testingQueries = {
  testingRepository,
};
