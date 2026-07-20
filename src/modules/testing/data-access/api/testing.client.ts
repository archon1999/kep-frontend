import { instance } from 'shared/api/http/axiosInstance.ts';
import { pollPendingResponse } from './testing.poll.ts';
import { finishTestRequest, startTestRequest } from './testing.requests.ts';

export interface TestsListParams {
  page?: number;
  pageSize?: number;
}

export const testingApiClient = {
  list: async (params?: TestsListParams) => {
    const response = await instance.get('/api/tests/', { params });
    return response.data;
  },
  getTest: async (testId: string) => {
    const response = await instance.get(`/api/tests/${testId}/`);
    return response.data;
  },
  getTestPass: async (testPassId: string) => {
    const response = await instance.get(`/api/test-pass/${testPassId}/`);
    return response.data;
  },
  getBestResults: async (testId: string) => {
    const response = await instance.get(`/api/tests/${testId}/best-results/`);
    return response.data;
  },
  getLastResults: async (testId: string) => {
    const response = await instance.get(`/api/tests/${testId}/last-results/`);
    return response.data;
  },
  startTest: async (testId: number) => {
    const response = await instance.request(startTestRequest(testId));
    return response.data;
  },
  submitAnswer: async (testPassId: number, questionNumber: number, answer: unknown) => {
    const response = await instance.post(`/api/test-pass/${testPassId}/submit-answer/`, {
      questionNumber,
      answer,
    });
    return response.data;
  },
  finishTest: async (testPassId: number) => {
    return pollPendingResponse(async () => {
      const response = await instance.request(finishTestRequest(testPassId));
      return response.data;
    });
  },
};
