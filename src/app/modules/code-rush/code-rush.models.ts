import { Problem } from "../problems/models/problems.models";

export enum CodeRushStatus {
  NOT_STARTED = -1,
  ALREADY = 0,
  FINISHED = 1,
}

export interface CodeRushPlayerProblemInfo {
  problemSymbol: string;
  isSolved: boolean;
  acceptedTime: string;
}

export interface CodeRushPlayer {
  rank: number;
  username: string;
  score: number;
  ratingTitle: string;
  lastAcceptedTime: string | null;
  problemsInfo: Array<CodeRushPlayerProblemInfo>;
}

export interface CodeRushProblem {
  symbol: string;
  problem: Problem;
}

export interface CodeRushUserInfo {
  isPlayer: boolean;
}

export interface CodeRush {
  id: number;
  startTime: Date;
  finishTime: Date;
  status: CodeRushStatus;
  players: Array<CodeRushPlayer>
  userInfo?: CodeRushUserInfo;
  problems?: Array<CodeRushProblem>;
}
