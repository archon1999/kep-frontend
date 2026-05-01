import { ProblemDetail } from 'modules/problems/domain/entities/problem.entity';

export interface ContestProblemInfo {
  problemSymbol: string;
  points: number;
  penalties: number;
  attemptsCount: number;
  firstAcceptedTime: string | null;
  theBest?: boolean;
  contestTime?: string | null;
}

export interface ContestProblemEntity {
  symbol: string;
  ball?: number;
  attemptsCount?: number;
  solved?: number;
  unsolved?: number;
  attemptUsersCount?: number;
  isSolved?: boolean;
  isAttempted?: boolean;
  duel?: number;
  problem: ProblemDetail;
}
