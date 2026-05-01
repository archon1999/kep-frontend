import { mapProblemDetail } from 'modules/problems/data-access/mappers/problems.mapper.ts';
import { ContestProblemEntity, ContestProblemInfo } from '../../domain/entities/contest-problem.entity';

const toNumber = (value: any): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const mapContestProblemInfo = (payload: any): ContestProblemInfo => ({
  problemSymbol: payload?.problemSymbol ?? payload?.problem_symbol ?? payload?.symbol ?? '',
  points: toNumber(payload?.points ?? payload?.ball ?? payload?.score),
  penalties: toNumber(payload?.penalties ?? payload?.penalty),
  attemptsCount: toNumber(payload?.attemptsCount ?? payload?.attempts_count ?? payload?.attempts),
  firstAcceptedTime: payload?.firstAcceptedTime ?? payload?.first_accepted_time ?? null,
  theBest: Boolean(payload?.theBest ?? payload?.is_best),
  contestTime: payload?.contestTime ?? payload?.contest_time ?? payload?.time ?? null,
});

export const mapContestProblem = (payload: any): ContestProblemEntity => ({
  symbol: payload?.symbol ?? payload?.problemSymbol ?? '',
  ball: toNumber(payload?.ball ?? payload?.balls ?? payload?.problem_ball),
  attemptsCount: toNumber(payload?.attemptsCount ?? payload?.attempts_count ?? payload?.attempts),
  solved: toNumber(payload?.solved),
  unsolved: toNumber(payload?.unsolved),
  attemptUsersCount: toNumber(payload?.attemptUsersCount ?? payload?.attempt_users_count),
  isSolved: Boolean(payload?.isSolved ?? payload?.solved ?? payload?.is_solved),
  isAttempted: Boolean(payload?.isAttempted ?? payload?.attempted ?? payload?.is_attempted),
  duel: payload?.duel ?? undefined,
  problem: mapProblemDetail(payload?.problem ?? payload),
});
