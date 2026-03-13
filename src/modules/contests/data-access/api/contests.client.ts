import { apiClient } from 'shared/api';
import {
  ApiContestsList200,
  ApiContestsListParams,
  ApiContestsRatingList200,
  ApiContestsRatingListParams,
  ApiContestsNewContestantsListParams,
  ApiContestsRegistrantsListParams,
  ContestsRatingDetail,
  ContestsCategory,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const contestsApiClient = {
  list: (params?: ApiContestsListParams) => apiClient.apiContestsList(params) as Promise<ApiContestsList200>,
  categories: () => apiClient.apiContestsCategoriesList() as Promise<ContestsCategory[]>,
  rating: (params?: ApiContestsRatingListParams) =>
    apiClient.apiContestsRatingList(params) as Promise<ApiContestsRatingList200>,
  ratingChanges: (username: string) =>
    apiClient.apiContestsRatingRatingChanges(username) as Promise<ContestsRatingDetail>,
  userStatistics: (username: string) =>
    apiClient.apiContestsRatingStatistics(username) as Promise<any>,
  top3Contestants: (contestId: number | string) =>
    apiClient.apiContestsTop3Contestants(String(contestId)) as Promise<any>,
  getById: (id: number | string) => apiClient.apiContestsRead(String(id)) as Promise<any>,
  getMe: (id: number | string) => apiClient.apiContestsMe(String(id)) as Promise<any>,
  getProblems: (id: number | string) => apiClient.apiContestsProblems(String(id)) as Promise<any>,
  getProblem: (id: number | string, symbol: string) =>
    apiClient.apiContestsProblem(String(id), { params: { symbol } }) as Promise<any>,
  getStandings: (id: number | string, params?: ApiContestsNewContestantsListParams) =>
    apiClient.apiContestsNewContestantsList(String(id), params) as Promise<any>,
  getFilters: (id: number | string) => apiClient.apiContestsFilters(String(id)) as Promise<any>,
  getContestants: (id: number | string) => apiClient.apiContestsContestants(String(id)) as Promise<any>,
  getRegistrants: (id: number | string, params?: ApiContestsRegistrantsListParams) =>
    apiClient.apiContestsRegistrantsList(String(id), params) as Promise<any>,
  getQuestions: (id: number | string) => apiClient.apiContestsQuestions(String(id)) as Promise<any>,
  register: (id: number | string, payload?: Record<string, unknown>) =>
    apiClient.apiContestsRegistrationCreate(String(id), (payload ?? {}) as any),
  cancelRegistration: (id: number | string) => apiClient.apiContestsCancelRegistration(String(id)) as Promise<any>,
  submitQuestion: (
    id: number | string,
    payload: { problem?: string | null; question: string },
  ) => apiClient.apiContestsNewQuestion(String(id), payload as any),
  getStatistics: (id: number | string) => apiClient.apiContestsStatistics(String(id)) as Promise<any>,
  submitSolution: (
    id: number | string,
    payload: { contestProblem: string; sourceCode: string; lang: string },
  ) => apiClient.apiContestsSubmit(String(id), payload as any),
};
