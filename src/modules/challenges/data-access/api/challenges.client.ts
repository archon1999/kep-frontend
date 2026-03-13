import { instance } from 'shared/api/http/axiosInstance.ts';

export interface ChallengeListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  arenaId?: number;
  ordering?: string;
}

export const challengesApiClient = {
  getChallengeCalls: async () => {
    const response = await instance.get('/api/challenge-calls/');
    return response.data;
  },
  createChallengeCall: async (payload: { timeSeconds: number; questionsCount: number; chapters?: number[] }) => {
    const response = await instance.post('/api/challenge-calls/new/', {
      time_seconds: payload.timeSeconds,
      questions_count: payload.questionsCount,
      chapters: payload.chapters ?? [],
    });
    return response.data;
  },
  deleteChallengeCall: async (challengeCallId: number) => {
    const response = await instance.delete(`/api/challenge-calls/${challengeCallId}/delete/`);
    return response.data;
  },
  acceptChallengeCall: async (challengeCallId: number) => {
    const response = await instance.post(`/api/challenge-calls/${challengeCallId}/accept/`);
    return response.data;
  },
  listChallenges: async (params?: ChallengeListParams) => {
    const response = await instance.get('/api/challenges/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        username: params?.username,
        arenaId: params?.arenaId,
        ordering: params?.ordering,
      },
    });
    return response.data;
  },
  getChallenge: async (challengeId: number | string) => {
    const response = await instance.get(`/api/challenges/${challengeId}/`);
    return response.data;
  },
  startChallenge: async (challengeId: number) => {
    const response = await instance.post(`/api/challenges/${challengeId}/start/`);
    return response.data;
  },
  submitAnswer: async (challengeId: number, body: { answer: unknown; finish?: boolean }) => {
    const response = await instance.post(`/api/challenges/${challengeId}/check-answer/`, body);
    return response.data;
  },
  listRating: async (params?: ChallengeListParams) => {
    const response = await instance.get('/api/challenges-rating/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        ordering: params?.ordering,
      },
    });
    return response.data;
  },
  listRatingChanges: async (username: string) => {
    const response = await instance.get(`/api/challenges-rating/${username}/rating-changes/`);
    return response.data;
  },
  getUserRating: async (username: string) => {
    const response = await instance.get(`/api/challenges-rating/${username}/`);
    return response.data;
  },
  listUserChallenges: async (params: { username: string; page?: number; pageSize?: number }) => {
    const response = await instance.get('/api/challenges/', {
      params: {
        username: params.username,
        page: params.page,
        page_size: params.pageSize,
      },
    });
    return response.data;
  },
  listChapters: async () => {
    const response = await instance.get('/api/chapters/');
    return response.data;
  },
};
