import { instance } from 'shared/api/http/axiosInstance.ts';
import {
  DuelCounterPayload,
  DuelCreatePayload,
  DuelsListParams,
  ReadyPlayersParams,
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
  getReadyStatus: async () => {
    const response = await instance.get('/api/duels/ready-status/');
    return response.data;
  },
  updateReadyStatus: async (ready: boolean) => {
    const response = await instance.put('/api/duels/ready-status/', { ready });
    return response.data;
  },
  listReadyPlayers: async (params?: ReadyPlayersParams) => {
    const response = await instance.get('/api/duels/ready-users/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
      },
    });
    return response.data;
  },
  listDuelPresets: async (username: string) => {
    const response = await instance.get('/api/duels/duel-presets/', { params: { username } });
    return response.data;
  },
  listDuelInvitations: async (params?: { page?: number; pageSize?: number }) => {
    const response = await instance.get('/api/duel-invitations/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
      },
    });
    return response.data;
  },
  createInvitation: async (payload: DuelCreatePayload) => {
    const response = await instance.post('/api/duel-invitations/', {
      duel_username: payload.duelUsername,
      duel_preset: payload.duelPresetId,
      proposed_start_time: payload.startTime,
    });
    return response.data;
  },
  acceptInvitation: async (id: number | string) => {
    const response = await instance.post(`/api/duel-invitations/${id}/accept/`, {});
    return response.data;
  },
  rejectInvitation: async (id: number | string) => {
    const response = await instance.post(`/api/duel-invitations/${id}/reject/`, {});
    return response.data;
  },
  counterInvitation: async (id: number | string, payload: DuelCounterPayload) => {
    const response = await instance.post(`/api/duel-invitations/${id}/counter/`, {
      proposed_start_time: payload.startTime,
    });
    return response.data;
  },
  listRating: async (params?: { page?: number; pageSize?: number; ordering?: string }) => {
    const response = await instance.get('/api/duels-rating/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        ordering: params?.ordering,
      },
    });
    return response.data;
  },
};
