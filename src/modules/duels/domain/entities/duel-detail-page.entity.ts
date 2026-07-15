import { Duel, DuelPlayer } from './duel.entity.ts';

export type DuelDetailPageWorkspaceView = 'problems' | 'standings';
export type DuelDetailPageWorkspaceTab = 'description' | 'attempts';

export interface DuelDetailPageNavigationProblem {
  symbol: string;
  problemId?: number;
  ball?: number;
  playerFirstBall?: number;
  playerSecondBall?: number;
  isLocked?: boolean;
  isClaimed?: boolean;
  firstAcceptedAttemptId?: number;
  unlockAt?: string | null;
  firstAcceptedByUserId?: number;
  firstAcceptedByUsername?: string | null;
}

export interface DuelDetailPagePlayerRow {
  key: string;
  order: number;
  accent: 'primary' | 'secondary';
  player: DuelPlayer;
  scoreAccessor: (problem: DuelDetailPageNavigationProblem) => number;
}

export interface DuelDetailPageStandingRow extends DuelDetailPagePlayerRow {
  total: number;
  rank: number;
}

export const getDuelDetailPagePlayerRows = (duel: Duel): DuelDetailPagePlayerRow[] =>
  [
    {
      key: 'player_first',
      order: 0,
      accent: 'primary' as const,
      player: duel.playerFirst,
      scoreAccessor: (problem: DuelDetailPageNavigationProblem) => problem.playerFirstBall ?? 0,
    },
    duel.playerSecond
      ? {
          key: 'player_second',
          order: 1,
          accent: 'secondary' as const,
          player: duel.playerSecond,
          scoreAccessor: (problem: DuelDetailPageNavigationProblem) =>
            problem.playerSecondBall ?? 0,
        }
      : null,
  ].filter(Boolean) as DuelDetailPagePlayerRow[];
