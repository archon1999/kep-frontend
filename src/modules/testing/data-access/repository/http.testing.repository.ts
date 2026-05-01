import { testingApiClient, type TestsListParams } from '../api/testing.client.ts';
import {
  hydrateQuestion,
  mapFinishTestResponse,
  mapPageResult,
  mapStartTestResponse,
  mapTest,
  mapTestPass,
  mapTestResults,
} from '../mappers/test.mapper.ts';
import {
  FinishTestResponse,
  PageResult,
  StartTestResponse,
  TestResultRow,
  TestingRepository,
} from '../../domain/ports/testing.repository.ts';
import { Question, TestPass, Test } from '../../domain';

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

  hydrateQuestion(question: Question): Question {
    return hydrateQuestion(question);
  }
}
