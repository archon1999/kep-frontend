import { Test, TestPass } from '../../domain';
import {
  FinishTestResponse,
  PageResult,
  StartTestResponse,
  TestResultRow,
  TestingRepository,
} from '../../domain/contracts/testing.repository.ts';
import { type TestsListParams, testingApiClient } from '../api/testing.client.ts';
import {
  mapFinishTestResponse,
  mapPageResult,
  mapStartTestResponse,
  mapTest,
  mapTestPass,
  mapTestResults,
} from '../mappers/test.mapper.ts';

export class HttpTestingRepository implements TestingRepository {
  async listTests(params?: TestsListParams): Promise<PageResult<Test>> {
    const result = await testingApiClient.list(params);
    return mapPageResult<Test>(result, mapTest);
  }

  async getTest(testId: string): Promise<Test> {
    const result = await testingApiClient.getTest(testId);
    return mapTest(result);
  }

  async getTestPass(testPassId: string): Promise<TestPass> {
    const result = await testingApiClient.getTestPass(testPassId);
    return mapTestPass(result);
  }

  async getBestResults(testId: string): Promise<TestResultRow[]> {
    const result = await testingApiClient.getBestResults(testId);
    return mapTestResults(result);
  }

  async getLastResults(testId: string): Promise<TestResultRow[]> {
    const result = await testingApiClient.getLastResults(testId);
    return mapTestResults(result);
  }

  async startTest(testId: number): Promise<StartTestResponse> {
    const result = await testingApiClient.startTest(testId);
    return mapStartTestResponse(result);
  }

  async submitAnswer(testPassId: number, questionNumber: number, answer: unknown): Promise<void> {
    await testingApiClient.submitAnswer(testPassId, questionNumber, answer);
  }

  async finishTest(testPassId: number): Promise<FinishTestResponse> {
    const response = await testingApiClient.finishTest(testPassId);
    return mapFinishTestResponse(response);
  }
}
