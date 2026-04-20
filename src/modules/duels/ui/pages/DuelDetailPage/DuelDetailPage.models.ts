import { Duel, DuelPlayer } from 'modules/duels/domain/index.ts';

export type DuelDetailPageWorkspaceView = 'problems' | 'standings';
export type DuelDetailPageWorkspaceTab = 'description' | 'attempts';

export interface DuelDetailPageNavigationProblem {
  symbol: string;
  ball?: number;
  playerFirstBall?: number;
  playerSecondBall?: number;
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
