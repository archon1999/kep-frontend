import { Problem } from '@problems/models/problems.models';

export interface ContestProblem {
  problem: Problem;
  symbol: string;
  ball: number;
  attemptsCount: number;
  solved: number;
  unsolved: number;
  attemptUsersCount: number;
  isSolved: boolean;
  isAttempted: boolean;
}
