import { ProblemDetail } from 'modules/problems/domain/entities/problem.entity.ts';

export type DuelStatus = -1 | 0 | 1;
export type DuelViewerRole = 'player_first' | 'player_second' | 'spectator';
export type DuelInvitationViewerRole = 'challenger' | 'invitee' | 'spectator';
export type DuelInvitationStatus = 1 | 2 | 3 | 4 | 5;

export interface DuelPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: DuelStatus | null;
  balls?: number;
}

export interface DuelProblem {
  symbol: string;
  ball?: number;
  playerFirstBall?: number;
  playerSecondBall?: number;
  problem?: ProblemDetail;
}

export interface DuelPresetTypeInfo {
  id?: number;
  code?: string;
  title?: string;
  description?: string;
}

export interface DuelPresetCategory {
  id?: number;
  code?: string;
  title?: string;
}

export interface DuelPresetProblem {
  id?: number;
  symbol?: string;
  ball?: number;
}

export interface DuelPreset {
  id?: number;
  type?: string;
  typeInfo?: DuelPresetTypeInfo;
  difficulty?: number;
  difficultyDisplay?: string;
  title?: string;
  description?: string;
  duration?: string;
  category?: DuelPresetCategory | string;
  problemsCount?: number;
  problems?: DuelPresetProblem[];
}

export interface Duel {
  id: number;
  startTime?: string | null;
  finishTime?: string | null;
  status: DuelStatus;
  isPlayer?: boolean;
  isConfirmed?: boolean;
  viewerRole?: DuelViewerRole;
  canSubmitForDuel?: boolean;
  playerFirst: DuelPlayer;
  playerSecond?: DuelPlayer | null;
  preset?: DuelPreset | null;
  problems?: DuelProblem[];
}

export interface DuelResults {
  playerFirst?: number[];
  playerSecond?: number[];
}

export interface DuelReadyStatus {
  ready: boolean;
}

export interface DuelReadyPlayer {
  username: string;
  fullName?: string;
  avatar?: string;
  wins?: number;
  draws?: number;
  losses?: number;
}

export interface DuelInvitationUser {
  id?: number;
  username: string;
}

export interface DuelInvitationProblem {
  symbol: string;
  ball?: number;
}

export interface DuelInvitation {
  id: number;
  status: DuelInvitationStatus;
  challenger: DuelInvitationUser;
  invitee: DuelInvitationUser;
  otherUser?: DuelInvitationUser | null;
  preset?: DuelPreset | null;
  proposedStartTime?: string | null;
  actionRequiredBy?: DuelInvitationUser | null;
  viewerRole?: DuelInvitationViewerRole;
  problems?: DuelInvitationProblem[];
  duelId?: number | null;
  canAccept?: boolean;
  canCounter?: boolean;
  canReject?: boolean;
  requiresResponse?: boolean;
  created?: string;
  updated?: string;
}
