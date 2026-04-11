import type {
  ContestProblemEntity,
  ContestProblemInfo,
} from '../../../domain/entities/contest-problem.entity';
import type { ProblemResultView, ResultColor } from './types';

export const emptyResult: ProblemResultView = { label: '-', color: 'default' };

export const solvedResult = (
  info: ContestProblemInfo,
  label: string,
  color: ResultColor = 'success',
  helper?: string | null,
): ProblemResultView => ({
  label,
  color,
  helper: helper ?? undefined,
  isBest: info.theBest,
});

export const problemBallOrDefault = (problem?: ContestProblemEntity) => problem?.ball ?? 10;
