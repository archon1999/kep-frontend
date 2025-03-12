import { Problem } from '@problems/models/problems.models';

export type DuelStatus = -1 | 0 | 1;

export interface DuelPlayer {
  id: number;
  username: string;
  status: number,
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
  playerFirst: DuelPlayer;
  playerSecond: DuelPlayer;
  problems?: Array<DuelProblem>;
}
