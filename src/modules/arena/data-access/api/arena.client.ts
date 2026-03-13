import { instance } from 'shared/api/http/axiosInstance.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity';
import { ArenaChallengesFilters, ArenaListFilters, ArenaPlayersFilters } from '../../domain/ports/arena.repository';

export const arenaApiClient = {
  list: async (filters?: ArenaListFilters) => {
    const response = await instance.get('/api/arena/', { params: filters });
    return response.data;
  },
  getArena: async (arenaId: number | string) => {
    const response = await instance.get(`/api/arena/${arenaId}/`);
    return response.data;
  },
  register: async (arenaId: number | string) => {
    const response = await instance.post(`/api/arena/${arenaId}/registration/`);
    return response.data;
  },
  pause: async (arenaId: number | string) => {
    const response = await instance.post(`/api/arena/${arenaId}/pause/`);
    return response.data;
  },
  start: async (arenaId: number | string) => {
    const response = await instance.post(`/api/arena/${arenaId}/start/`);
    return response.data;
  },
  nextChallenge: async (arenaId: number | string) => {
    const response = await instance.get(`/api/arena/${arenaId}/next-challenge/`);
    return response.data;
  },
  listPlayers: async (arenaId: number | string, filters?: ArenaPlayersFilters) => {
    const params = { ...filters, arena_id: arenaId };
    const response = await instance.get('/api/arena-players/', { params });
    return response.data;
  },
  listChallenges: async (arenaId: number | string, filters?: ArenaChallengesFilters) => {
    const response = await instance.get(`/api/arena/${arenaId}/last-challenges/`, { params: filters });
    return response;
  },
  playerStatistics: async (arenaId: number | string, username: string) => {
    const response = await instance.get(`/api/arena/${arenaId}/arena-player-statistics/`, { params: { username } });
    return response.data;
  },
  topPlayers: async (arenaId: number | string) => {
    const response = await instance.get(`/api/arena/${arenaId}/top-3/`);
    return response.data;
  },
  statistics: async (arenaId: number | string) => {
    const response = await instance.get(`/api/arena/${arenaId}/statistics/`);
    return response.data;
  },
};

export const statusOptions: { label: string; value: ArenaStatus }[] = [
  { label: 'Not started', value: ArenaStatus.NotStarted },
  { label: 'Live', value: ArenaStatus.Already },
  { label: 'Finished', value: ArenaStatus.Finished },
];
