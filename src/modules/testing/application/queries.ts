import useSWR from 'swr';
import { HttpTestingRepository } from '../data-access/repository/http.testing.repository.ts';
import { Test, TestPass } from '../domain';
import { PageResult, TestResultRow } from '../domain/ports/testing.repository.ts';

const testingRepository = new HttpTestingRepository();

export const useTestsList = (params?: { page?: number; pageSize?: number }) =>
  useSWR<PageResult<Test>>(['tests-list', params?.page, params?.pageSize], () =>
    testingRepository.listTests(params),
  );

export const useTestsCatalog = (userId?: string | number, enabled = true) =>
  useSWR<Test[]>(
    !enabled ? null : userId === undefined ? 'tests-catalog' : ['tests-catalog', userId],
    async () => {
      const pageSize = 50;
      const firstPage = await testingRepository.listTests({ page: 1, pageSize });
      const pagesCount = firstPage.pagesCount || Math.ceil(firstPage.total / pageSize);
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(0, pagesCount - 1) }, (_, index) =>
          testingRepository.listTests({ page: index + 2, pageSize }),
        ),
      );

      return [firstPage, ...remainingPages].flatMap((page) => page.data);
    },
  );

export const useTestDetail = (testId?: string) =>
  useSWR<Test>(testId ? ['test-detail', testId] : null, () => testingRepository.getTest(testId!));

export const useTestPass = (testPassId?: string) =>
  useSWR<TestPass>(testPassId ? ['test-pass', testPassId] : null, () =>
    testingRepository.getTestPass(testPassId!),
  );

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
