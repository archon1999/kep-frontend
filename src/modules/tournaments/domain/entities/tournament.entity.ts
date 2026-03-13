import { DuelPlayerStatus, TournamentDetailType, TournamentListType } from 'shared/api/orval/generated/endpoints/index.schemas';

export interface TournamentListItem {
  id: number;
  title: string;
  type: TournamentListType;
  startTime: string;
  playersCount: number;
}

export interface TournamentPlayerProfile {
  id: number;
  username: string;
  ratingTitle: string;
  status?: DuelPlayerStatus;
  balls?: number;
}

export interface TournamentStageMatch {
  number: number;
  duel: {
    id?: number;
    startTime?: string | null;
    finishTime?: string | null;
    status?: number;
    isConfirmed?: boolean;
    isPlayer?: string;
    playerFirst: TournamentPlayerProfile;
    playerSecond?: TournamentPlayerProfile;
  };
}

export interface TournamentStageInfo {
  title?: string;
  number: number;
  startTime?: string | null;
  duels: TournamentStageMatch[];
}

export interface TournamentDetailEntity {
  id?: number;
  title: string;
  description: string;
  type: TournamentDetailType;
  startTime: string;
  players: TournamentPlayerProfile[];
  stages: TournamentStageInfo[];
  isRegistered?: string | boolean;
}
