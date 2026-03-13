import { instance } from 'shared/api/http/axiosInstance.ts';
import { DuelCreatePayload, DuelsListParams, ReadyPlayersParams } from '../../domain/ports/duels.repository.ts';

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
  confirmDuel: async (id: number | string) => {
    const response = await instance.post(`/api/duels/${id}/confirm/`, {});
    return response.data;
  },
  getDuelResults: async (id: number | string) => {
    const response = await instance.get(`/api/duels/${id}/results/`);
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
  createDuel: async (payload: DuelCreatePayload) => {
    const response = await instance.post('/api/duels/duel-create/', {
      duel_username: payload.duelUsername,
      duel_preset: payload.duelPresetId,
      start_time: payload.startTime,
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
