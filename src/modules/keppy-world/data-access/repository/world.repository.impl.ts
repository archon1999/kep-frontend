import { instance } from 'shared/api/http/axiosInstance';
import type { WorldProfile, WorldRepository } from '../../domain';
import {
  mapBootstrap,
  mapLeaderboard,
  mapPointCooldowns,
  mapProfile,
  mapRun,
  mapServerTimeOffset,
  mapWorld,
} from '../mappers';

const base = '/api/world';
export const worldRepository: WorldRepository = {
  async bootstrap() {
    return mapBootstrap((await instance.get(`${base}/bootstrap/`)).data);
  },
  async profile(selection: Pick<WorldProfile, 'mascotId' | 'equippedCosmetic'>) {
    return mapProfile((await instance.patch(`${base}/profile/`, selection)).data);
  },
  async ticket() {
    return (await instance.post(`${base}/ticket/`)).data;
  },
  async claim(id) {
    return mapRun((await instance.post(`${base}/quests/${encodeURIComponent(id)}/claim/`)).data);
  },
  async submit(id, answer) {
    const { data } = await instance.post(`${base}/runs/${encodeURIComponent(id)}/submit/`, {
      answer,
    });
    return {
      correct: Boolean(data.correct),
      pointCooldowns: mapPointCooldowns(data),
      serverTimeOffsetMs: mapServerTimeOffset(data),
      feedback: data.feedback,
      run: mapRun(data.run),
      player: mapProfile(data.player),
      world: mapWorld(data.world),
    };
  },
  async abandon(id) {
    await instance.post(`${base}/runs/${encodeURIComponent(id)}/abandon/`);
  },
  async leaderboard(period, page = 1) {
    const { data } = await instance.get(`${base}/leaderboard/`, { params: { period, page } });
    return mapLeaderboard(data);
  },
};
