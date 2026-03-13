import { HttpTestingRepository } from '../data-access/repository/http.testing.repository.ts';
import { FinishTestResponse, StartTestResponse } from '../domain/ports/testing.repository.ts';

const testingRepository = new HttpTestingRepository();

export const startTest = (testId: number): Promise<StartTestResponse> => testingRepository.startTest(testId);

export const submitAnswer = (
  testPassId: number,
  questionNumber: number,
  answer: unknown,
): Promise<void> => testingRepository.submitAnswer(testPassId, questionNumber, answer);

export const finishTest = (testPassId: number): Promise<FinishTestResponse> =>
  testingRepository.finishTest(testPassId);

export const testingMutations = {
  startTest,
  submitAnswer,
  finishTest,
  testingRepository,
};
