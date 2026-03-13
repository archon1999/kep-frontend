import { AttemptListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import {
  Duel,
  DuelPreset,
  DuelReadyPlayer,
  DuelReadyStatus,
  DuelResults,
  DuelsRatingRow,
} from '../index.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface DuelsListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  ordering?: string;
}

export interface ReadyPlayersParams {
  page?: number;
  pageSize?: number;
}

export interface DuelCreatePayload {
  duelUsername: string;
  duelPresetId: number;
  startTime: string;
}

export interface DuelsRepository {
  getDuels: (params?: DuelsListParams) => Promise<PageResult<Duel>>;
  getMyDuels: (params?: DuelsListParams) => Promise<PageResult<Duel>>;
  getDuel: (id: number | string) => Promise<Duel>;
  confirmDuel: (id: number) => Promise<void>;
  getDuelResults: (id: number | string) => Promise<DuelResults>;
  getProblemAttempts: (duelId: number, duelProblem: string, pageSize?: number) => Promise<PageResult<AttemptListItem>>;

  getReadyStatus: () => Promise<DuelReadyStatus>;
  updateReadyStatus: (ready: boolean) => Promise<DuelReadyStatus>;
  getReadyPlayers: (params?: ReadyPlayersParams) => Promise<PageResult<DuelReadyPlayer>>;

  getDuelPresets: (username: string) => Promise<DuelPreset[]>;
  createDuel: (payload: DuelCreatePayload) => Promise<{ id?: number }>;

  getDuelsRating: (params?: { page?: number; pageSize?: number; ordering?: string }) => Promise<PageResult<DuelsRatingRow>>;
}
