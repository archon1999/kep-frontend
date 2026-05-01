import { ProblemDetail } from 'modules/problems/domain/entities/problem.entity.ts';

export type DuelStatus = -1 | 0 | 1;
export type DuelViewerRole = 'player_first' | 'player_second' | 'spectator';
export type DuelInvitationViewerRole = 'challenger' | 'invitee' | 'spectator';
export type DuelInvitationStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface DuelTypeInfo {
  id?: number;
  code?: string;
  title?: string;
  description?: string;
}

export interface DuelPlayer {
  id: number;
  username: string;
  displayName?: string;
  isBot?: boolean;
  contestsRating?: number;
  ratingTitle: string;
  status?: DuelStatus | null;
  balls?: number;
  penalty?: number;
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
  typeInfo?: DuelTypeInfo;
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
  duelType?: DuelTypeInfo | null;
  problems?: DuelProblem[];
}

export interface DuelResults {
  playerFirst?: number[];
  playerSecond?: number[];
}

export interface DuelReadyStatus {
  ready: boolean;
  readyUntil?: string | null;
}

export interface DuelReadyPlayer {
  username: string;
  fullName?: string;
  avatar?: string;
  wins?: number;
  draws?: number;
  losses?: number;
  contestsRating?: number;
  contestsRatingTitle?: string;
}

export interface DuelInvitationUser {
  id?: number;
  username: string;
  displayName?: string;
  avatar?: string | null;
  contestsRating?: number;
  contestsRatingTitle?: string;
  isBot?: boolean;
}

export interface DuelInvitationProblem {
  symbol: string;
  ball?: number;
}

export interface DuelInvitation {
  id: number;
  status: DuelInvitationStatus;
  challenger: DuelInvitationUser;
  invitee?: DuelInvitationUser | null;
  otherUser?: DuelInvitationUser | null;
  preset?: DuelPreset | null;
  duelType?: DuelTypeInfo | null;
  proposedStartTime?: string | null;
  actionRequiredBy?: DuelInvitationUser | null;
  viewerRole?: DuelInvitationViewerRole;
  problems?: DuelInvitationProblem[];
  duelId?: number | null;
  isBot?: boolean;
  canAccept?: boolean;
  acceptDisabledReason?: string | null;
  canConfirm?: boolean;
  confirmDisabledReason?: string | null;
  canCounter?: boolean;
  canReject?: boolean;
  canCancel?: boolean;
  requiresResponse?: boolean;
  created?: string;
  updated?: string;
}
