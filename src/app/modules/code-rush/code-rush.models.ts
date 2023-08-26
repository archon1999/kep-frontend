import { Problem } from "../problems/models/problems.models";

export type CodeRushStatus = -1 | 0 | 1;

export interface CodeRushPlayer {
    id: number;
    username: string;
    status: number;
    ratingTitle: string;
    score: number;
}

export interface CodeRushProblem {
    symbol: string;
    playerFirstStatus: number;
    playerSecondStatus: number;
    problem: Problem;
}

export interface CodeRush {
    id: number;
    startTime: Date;
    finished: Date;
    status: CodeRushStatus;
    isPlayer: boolean;
    playerFirst: CodeRushPlayer;
    playerSecond: CodeRushPlayer;
    problems?: Array<CodeRushProblem>;
}
