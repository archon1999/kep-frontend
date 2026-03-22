import { AttemptListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import {
  Duel,
  DuelInvitation,
  DuelPreset,
  DuelTypeInfo,
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

export type DuelCallScope = 'queue' | 'needs_response' | 'mine' | 'all';

export interface DuelCallsParams {
  page?: number;
  pageSize?: number;
  scope?: DuelCallScope;
}

export interface DuelCreatePayload {
  duelPresetId: number;
  duelTypeId: number;
}

export interface DuelAcceptPayload {
  proposedStartTime: string;
}

export interface DuelCounterPayload {
  proposedStartTime: string;
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

  getDuelPresets: () => Promise<DuelPreset[]>;
  getDuelTypes: () => Promise<DuelTypeInfo[]>;
  getDuelCalls: (params?: DuelCallsParams) => Promise<PageResult<DuelInvitation>>;
  createDuelCall: (payload: DuelCreatePayload) => Promise<DuelInvitation>;
  acceptDuelCall: (id: number, payload: DuelAcceptPayload) => Promise<DuelInvitation>;
  confirmDuelCall: (id: number) => Promise<DuelInvitation>;
  rejectDuelCall: (id: number) => Promise<DuelInvitation>;
  cancelDuelCall: (id: number) => Promise<DuelInvitation>;
  counterDuelCall: (id: number, payload: DuelCounterPayload) => Promise<DuelInvitation>;

  getDuelsRating: (params?: { page?: number; pageSize?: number; ordering?: string }) => Promise<PageResult<DuelsRatingRow>>;
}
