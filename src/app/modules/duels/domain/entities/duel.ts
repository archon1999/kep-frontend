import { Problem } from '@problems/models/problems.models';

export type DuelStatus = -1 | 0 | 1;

export interface DuelPlayer {
  id: number;
  username: string;
  status: number;
  ratingTitle: string;
  balls: number;
}

export interface DuelProblem {
  symbol: string;
  ball: number;
  playerFirstBall: number;
  playerSecondBall: number;
  problem: Problem;
}

export interface Duel {
  id: number;
  startTime: Date;
  finishTime: Date;
  status: DuelStatus;
  isPlayer: boolean;
  isConfirmed?: boolean;
  playerFirst: DuelPlayer;
  playerSecond: DuelPlayer | null;
  problems?: Array<DuelProblem>;
}

export interface DuelReadyPlayer {
  username: string;
  fullName: string;
  avatar: string;
  wins: number;
  draws: number;
  losses: number;
}

export interface DuelPresetProblem {
  id: number;
  symbol: string;
  ball: number;
}

export interface DuelPresetTypeInfo {
  id: number;
  code: string;
  title: string;
  description: string;
}

export interface DuelPresetCategory {
  id: number;
  title: string;
}

export interface DuelPreset {
  id: number;
  type: string;
  typeInfo: DuelPresetTypeInfo;
  difficulty: number;
  difficultyDisplay: string;
  title: string;
  description: string;
  duration: string;
  category: DuelPresetCategory;
  problemsCount: number;
  problems: Array<DuelPresetProblem>;
}

export interface DuelReadyStatus {
  ready: boolean;
}

export interface DuelResults {
  playerFirst: number[];
  playerSecond: number[];
}
