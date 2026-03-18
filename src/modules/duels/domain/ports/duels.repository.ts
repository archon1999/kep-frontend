import { AttemptListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import {
  Duel,
  DuelInvitation,
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

export interface DuelCounterPayload {
  startTime: string;
}

export interface DuelsRepository {
  getDuels: (params?: DuelsListParams) => Promise<PageResult<Duel>>;
  getMyDuels: (params?: DuelsListParams) => Promise<PageResult<Duel>>;
  getDuel: (id: number | string) => Promise<Duel>;
  getDuelResults: (id: number | string) => Promise<DuelResults>;
  getProblemAttempts: (duelId: number, duelProblem: string, pageSize?: number) => Promise<PageResult<AttemptListItem>>;
  submitToDuel: (
    duelId: number | string,
    payload: { duelProblem: string; sourceCode: string; lang: string },
  ) => Promise<void>;

  getReadyStatus: () => Promise<DuelReadyStatus>;
  updateReadyStatus: (ready: boolean) => Promise<DuelReadyStatus>;
  getReadyPlayers: (params?: ReadyPlayersParams) => Promise<PageResult<DuelReadyPlayer>>;

  getDuelPresets: (username: string) => Promise<DuelPreset[]>;
  getDuelInvitations: (params?: { page?: number; pageSize?: number }) => Promise<PageResult<DuelInvitation>>;
  createInvitation: (payload: DuelCreatePayload) => Promise<DuelInvitation>;
  acceptInvitation: (id: number) => Promise<DuelInvitation>;
  rejectInvitation: (id: number) => Promise<DuelInvitation>;
  counterInvitation: (id: number, payload: DuelCounterPayload) => Promise<DuelInvitation>;

  getDuelsRating: (params?: { page?: number; pageSize?: number; ordering?: string }) => Promise<PageResult<DuelsRatingRow>>;
}
