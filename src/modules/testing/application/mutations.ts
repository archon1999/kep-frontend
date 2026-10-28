import { testingRepository } from '../data-access';
import { FinishTestResponse, StartTestResponse } from '../domain/contracts/testing.repository.ts';

export const startTest = (testId: number): Promise<StartTestResponse> =>
  testingRepository.startTest(testId);

export const submitAnswer = (
  testPassId: number,
  questionNumber: number,
  answer: unknown,
): Promise<void> => testingRepository.submitAnswer(testPassId, questionNumber, answer);

export const finishTest = (testPassId: number): Promise<FinishTestResponse> =>
  testingRepository.finishTest(testPassId);
