import {
  ApiAttemptsListParams,
  ApiProblemsLastContestParams,
  ApiProblemsListParams,
  ApiProblemsRatingHistoryListParams,
  ApiProblemsRatingListParams,
  AttemptListBody,
  ProblemsCategory,
  ProblemsRating,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { apiClient } from 'shared/api';

export const problemsApiClient = {
  list: (params: ApiProblemsListParams) => apiClient.apiProblemsList(params),
  getProblem: (id: number | string) => apiClient.apiProblemsRead(String(id)),
  getProblemNext: (id: number | string) => apiClient.apiProblemsNext(String(id)),
  getProblemPrev: (id: number | string) => apiClient.apiProblemsPrev(String(id)),
  listLanguages: () => apiClient.apiProblemsLangs(),
  listCategories: () => apiClient.apiCategoriesList() as Promise<ProblemsCategory[]>,
  listMostViewed: () => apiClient.apiProblemsMostViewed(),
  getLastContest: (params?: ApiProblemsLastContestParams) => apiClient.apiProblemsLastContest(params),
  listUserAttempts: (params: ApiAttemptsListParams) => apiClient.apiAttemptsList(params),
  getUserRating: (username: string) => apiClient.apiProblemsRatingRead(username) as Promise<ProblemsRating>,
  getUserStatistics: (username: string, params?: { year?: number; days?: number }) =>
    apiClient.apiProblemsRatingProblemsStatistics(username, { params }),
  listRating: (params: ApiProblemsRatingListParams) => apiClient.apiProblemsRatingList(params),
  listRatingHistory: (params: ApiProblemsRatingHistoryListParams) =>
    apiClient.apiProblemsRatingHistoryList(params),
  listPeriodRating: (period: 'today' | 'week' | 'month') => {
    if (period === 'today') return apiClient.apiProblemsRatingToday();
    if (period === 'week') return apiClient.apiProblemsRatingWeek();
    return apiClient.apiProblemsRatingMonth();
  },
  getAttempt: (id: number | string) => apiClient.apiAttemptsRead(String(id)),
  purchaseAttempt: (attemptId: number | string) =>
    apiClient.apiAttemptsPurchase(String(attemptId), {} as AttemptListBody),
  purchaseAttemptTest: (attemptId: number | string) =>
    apiClient.apiAttemptsPurchaseTest(String(attemptId), {} as AttemptListBody),
  listAttempts: (params: ApiAttemptsListParams) => apiClient.apiAttemptsList(params),
  listVerdicts: () => apiClient.apiAttemptsVerdicts(),
  rerunAttempt: (attemptId: number) => apiClient.apiAttemptsRerun(attemptId.toString(), {} as AttemptListBody),
  likeProblem: (problemId: number | string) => apiClient.apiProblemsLike(String(problemId), {} as any),
  dislikeProblem: (problemId: number | string) => apiClient.apiProblemsDislike(String(problemId), {} as any),
  addFavorite: (problemId: number | string) => apiClient.apiProblemsAddFavorites(String(problemId), {} as any),
  removeFavorite: (problemId: number | string) => apiClient.apiProblemsDeleteFavorites(String(problemId)),
  listTags: () => apiClient.apiTagsList(),
  listTopics: () => apiClient.apiProblemsTopics(),
  addTag: (problemId: number | string, tagId: number) =>
    apiClient.apiProblemsAddTag(String(problemId), { tagId } as any),
  removeTag: (problemId: number | string, tagId: number) =>
    apiClient.apiProblemsRemoveTag(String(problemId), { tagId } as any),
  addTopic: (problemId: number | string, topicId: number) =>
    apiClient.apiProblemsAddTopic(String(problemId), { topic_id: topicId } as any),
  removeTopic: (problemId: number | string, topicId: number) =>
    apiClient.apiProblemsRemoveTopic(String(problemId), { topic_id: topicId } as any),
  getSolution: (problemId: number | string) => apiClient.apiProblemsSolution(String(problemId)),
  purchaseSolution: (problemId: number | string) =>
    apiClient.apiProblemsPurchaseSolution(String(problemId), {} as any),
  purchaseCheckSamples: (problemId: number | string) =>
    apiClient.apiProblemsPurchaseCheckSamples(String(problemId), {} as any),
  getStatistics: (problemId: number | string) => apiClient.apiProblemsStatistics(String(problemId)),
  saveCheckInput: (problemId: number | string, payload: any) =>
    apiClient.apiProblemsSaveCheckInput(String(problemId), payload),
  submit: (problemId: number | string, payload: any) =>
    apiClient.apiProblemsSubmit(String(problemId), payload),
  customTest: (payload: any) => apiClient.apiProblemsCustomTest(payload),
  answerForInput: (problemId: number | string, payload: any) =>
    apiClient.apiProblemsAnswerForInput(String(problemId), payload),
  checkSampleTests: (problemId: number | string, payload: any) =>
    apiClient.apiProblemsCheckSampleTests(String(problemId), payload),
  listHackAttempts: (params: any) => apiClient.apiHackAttemptsList(params),
  rerunHackAttempt: (hackAttemptId: number | string) =>
    apiClient.apiHackAttemptsRerun(String(hackAttemptId), {} as any),
};
