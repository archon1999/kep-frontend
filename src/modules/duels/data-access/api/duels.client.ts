import { instance } from 'shared/api/http/axiosInstance.ts';
import {
  DuelAcceptPayload,
  DuelCounterPayload,
  DuelCreatePayload,
  DuelCallsParams,
  DuelsListParams,
} from '../../domain/ports/duels.repository.ts';

const mapListParams = (params?: DuelsListParams) => ({
  page: params?.page,
  page_size: params?.pageSize,
  username: params?.username,
  ordering: params?.ordering,
});

export const duelsApiClient = {
  listDuels: async (params?: DuelsListParams) => {
    const response = await instance.get('/api/duels/', { params: mapListParams(params) });
    return response.data;
  },
  listMyDuels: async (params?: DuelsListParams) => {
    const response = await instance.get('/api/duels/my/', { params: mapListParams(params) });
    return response.data;
  },
  getDuel: async (id: number | string) => {
    const response = await instance.get(`/api/duels/${id}/`);
    return response.data;
  },
  getDuelResults: async (id: number | string) => {
    const response = await instance.get(`/api/duels/${id}/results/`);
    return response.data;
  },
  submitToDuel: async (
    id: number | string,
    payload: { duelProblem: string; sourceCode: string; lang: string },
  ) => {
    const response = await instance.post(`/api/duels/${id}/submit/`, {
      duel_problem: payload.duelProblem,
      source_code: payload.sourceCode,
      lang: payload.lang,
    });
    return response.data;
  },
  getProblemAttempts: async (duelId: number, duelProblem: string, pageSize = 20) => {
    const response = await instance.get('/api/attempts/', {
      params: {
        duel_id: duelId,
        duel_problem: duelProblem,
        page_size: pageSize,
      },
    });
    return response.data;
  },
  listDuelPresets: async () => {
    const response = await instance.get('/api/duels/duel-presets/');
    return response.data;
  },
  listDuelTypes: async () => {
    const response = await instance.get('/api/duel-types/');
    return response.data;
  },
  listDuelCalls: async (params?: DuelCallsParams) => {
    const response = await instance.get('/api/duel-calls/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        scope: params?.scope,
      },
    });
    return response.data;
  },
  createDuelCall: async (payload: DuelCreatePayload) => {
    const response = await instance.post('/api/duel-calls/', {
      preset_id: payload.duelPresetId,
      duel_type_id: payload.duelTypeId,
    });
    return response.data;
  },
  acceptDuelCall: async (id: number | string, payload: DuelAcceptPayload) => {
    const response = await instance.post(`/api/duel-calls/${id}/accept/`, {
      proposed_start_time: payload.proposedStartTime,
    });
    return response.data;
  },
  confirmDuelCall: async (id: number | string) => {
    const response = await instance.post(`/api/duel-calls/${id}/confirm/`, {}, {
      params: { scope: 'mine' },
    });
    return response.data;
  },
  rejectDuelCall: async (id: number | string) => {
    const response = await instance.post(`/api/duel-calls/${id}/reject/`, {}, {
      params: { scope: 'mine' },
    });
    return response.data;
  },
  cancelDuelCall: async (id: number | string) => {
    const response = await instance.post(`/api/duel-calls/${id}/cancel/`, {}, {
      params: { scope: 'mine' },
    });
    return response.data;
  },
  counterDuelCall: async (id: number | string, payload: DuelCounterPayload) => {
    const response = await instance.post(
      `/api/duel-calls/${id}/counter/`,
      {
        proposed_start_time: payload.proposedStartTime,
      },
      { params: { scope: 'mine' } },
    );
    return response.data;
  },
  listRating: async (params?: {
    page?: number;
    pageSize?: number;
    ordering?: string;
    pinCurrentUser?: boolean;
  }) => {
    const response = await instance.get('/api/duels-rating/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        ordering: params?.ordering,
        pin_current_user: params?.pinCurrentUser || undefined,
      },
    });
    return response.data;
  },
};
