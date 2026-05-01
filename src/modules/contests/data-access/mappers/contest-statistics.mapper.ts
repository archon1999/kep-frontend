import {
  ContestRatingChange,
  ContestUserStatistics,
  ContestUserStatisticsContestDeltaEntry,
  ContestUserStatisticsContestDeltas,
  ContestUserStatisticsContestRankEntry,
  ContestUserStatisticsContestRanks,
  ContestUserStatisticsGeneral,
  ContestUserStatisticsLanguage,
  ContestUserStatisticsOpponent,
  ContestUserStatisticsOpponentContest,
  ContestUserStatisticsOverview,
  ContestUserStatisticsSingleAttemptProblems,
  ContestUserStatisticsSymbol,
  ContestUserStatisticsTag,
  ContestUserStatisticsTimelineEntry,
  ContestUserStatisticsTopAttempt,
  ContestUserStatisticsUnsolvedProblem,
  ContestUserStatisticsVerdict,
} from '../../domain/entities/contest-user-statistics.entity';
import {
  ContestStatistics,
  ContestStatisticsBadgeEntry,
  ContestStatisticsContestant,
  ContestStatisticsFirstSolve,
  ContestStatisticsSummary,
  ContestStatisticsTimelineEntry,
  ContestStatisticsVerdicts,
} from '../../domain/entities/contest-statistics.entity';
import { ContestantTeamMember } from '../../domain/entities/contestant.entity';

const toNumber = (value: any): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapGeneral = (payload: any): ContestUserStatisticsGeneral => ({
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? '',
  contestantsCount: toNumber(payload?.contestantsCount ?? payload?.contestants_count),
  maxRating: toNumber(payload?.maxRating ?? payload?.max_rating),
  maxRatingTitle: payload?.maxRatingTitle ?? payload?.max_rating_title ?? '',
  ratingPlace: toNumber(payload?.ratingPlace ?? payload?.rating_place ?? payload?.place),
  rating: toNumber(payload?.rating ?? payload?.rating_value ?? payload?.value),
});

const mapSingleAttemptProblems = (
  payload: any,
): ContestUserStatisticsSingleAttemptProblems | null => {
  if (!payload) return null;

  return {
    count: toNumber(payload?.count),
    percentage: toNumber(payload?.percentage),
  };
};

const mapOverview = (payload: any): ContestUserStatisticsOverview => ({
  totalAttempts: toNumber(payload?.totalAttempts ?? payload?.total_attempts),
  totalAccepted: toNumber(payload?.totalAccepted ?? payload?.total_accepted),
  averageAttemptsPerProblem: toNumber(
    payload?.averageAttemptsPerProblem ?? payload?.average_attempts_per_problem,
  ),
  mostAttemptsProblem: payload?.mostAttemptsProblem ?? payload?.most_attempts_problem ?? null,
  singleAttemptProblems: mapSingleAttemptProblems(
    payload?.singleAttemptProblems ?? payload?.single_attempt_problems,
  ),
  fastestSolve: payload?.fastestSolve ?? payload?.fastest_solve ?? null,
  slowestSolve: payload?.slowestSolve ?? payload?.slowest_solve ?? null,
});

const mapContestRankEntry = (payload: any): ContestUserStatisticsContestRankEntry => ({
  contestId: toNumber(payload?.contestId ?? payload?.contest_id ?? payload?.id),
  contestTitle: payload?.contestTitle ?? payload?.contest_title ?? payload?.title ?? '',
  rank: toNumber(payload?.rank ?? payload?.place ?? payload?.position),
  participantsCount: toNumber(
    payload?.participantsCount ?? payload?.participants_count ?? payload?.participants,
  ),
});

const mapContestDeltaEntry = (payload: any): ContestUserStatisticsContestDeltaEntry => ({
  contestId: toNumber(payload?.contestId ?? payload?.contest_id ?? payload?.id),
  contestTitle: payload?.contestTitle ?? payload?.contest_title ?? payload?.title ?? '',
  delta: toNumber(payload?.delta ?? payload?.ratingDelta ?? payload?.change),
  participantsCount: toNumber(
    payload?.participantsCount ?? payload?.participants_count ?? payload?.participants,
  ),
});

const mapContestRanks = (payload: any): ContestUserStatisticsContestRanks => ({
  best: payload?.best ? mapContestRankEntry(payload.best) : null,
  worst: payload?.worst ? mapContestRankEntry(payload.worst) : null,
});

const mapContestDeltas = (payload: any): ContestUserStatisticsContestDeltas => ({
  best: payload?.best ? mapContestDeltaEntry(payload.best) : null,
  worst: payload?.worst ? mapContestDeltaEntry(payload.worst) : null,
});

const mapUnsolvedProblem = (payload: any): ContestUserStatisticsUnsolvedProblem => ({
  contestId: toNumber(payload?.contestId ?? payload?.contest_id ?? payload?.id),
  contestTitle: payload?.contestTitle ?? payload?.contest_title ?? payload?.title ?? '',
  problemSymbol: payload?.problemSymbol ?? payload?.problem_symbol ?? payload?.symbol ?? '',
});

const mapLanguage = (payload: any): ContestUserStatisticsLanguage => ({
  lang: payload?.lang ?? payload?.code ?? payload?.language ?? '',
  langFull: payload?.langFull ?? payload?.lang_full ?? payload?.langFullName ?? payload?.name ?? '',
  attemptsCount: toNumber(payload?.attemptsCount ?? payload?.attempts_count ?? payload?.attempts),
});

const mapVerdict = (payload: any): ContestUserStatisticsVerdict => ({
  verdict: payload?.verdict ?? payload?.code ?? payload?.label ?? '',
  attemptsCount: toNumber(payload?.attemptsCount ?? payload?.attempts_count ?? payload?.attempts),
});

const mapTag = (payload: any): ContestUserStatisticsTag => ({
  name: payload?.name ?? '',
  solved: toNumber(payload?.solved ?? payload?.count),
});

const mapSymbol = (payload: any): ContestUserStatisticsSymbol => ({
  symbol: payload?.symbol ?? payload?.name ?? '',
  solved: toNumber(payload?.solved ?? payload?.count),
});

const mapTimelineEntry = (payload: any): ContestUserStatisticsTimelineEntry => ({
  range: payload?.range ?? payload?.label ?? payload?.period ?? '',
  attempts: toNumber(payload?.attempts ?? payload?.count),
});

const mapTopAttempt = (payload: any): ContestUserStatisticsTopAttempt => ({
  contestId: toNumber(payload?.contestId ?? payload?.contest_id ?? payload?.id),
  contestTitle: payload?.contestTitle ?? payload?.contest_title ?? payload?.title ?? '',
  problemSymbol: payload?.problemSymbol ?? payload?.problem_symbol ?? payload?.symbol ?? '',
  attemptsCount: toNumber(payload?.attemptsCount ?? payload?.attempts_count ?? payload?.attempts),
  solved: Boolean(payload?.solved ?? payload?.isSolved ?? payload?.accepted),
});

const mapOpponentContest = (payload: any): ContestUserStatisticsOpponentContest => ({
  contestId: toNumber(payload?.contestId ?? payload?.contest_id ?? payload?.id),
  contestTitle: payload?.contestTitle ?? payload?.contest_title ?? payload?.title ?? '',
  userRank: toNumber(payload?.userRank ?? payload?.user_rank ?? payload?.userPlace),
  opponentRank: toNumber(payload?.opponentRank ?? payload?.opponent_rank ?? payload?.opponentPlace),
  userPoints: toNumber(payload?.userPoints ?? payload?.user_points ?? payload?.userScore),
  opponentPoints: toNumber(
    payload?.opponentPoints ?? payload?.opponent_points ?? payload?.opponentScore,
  ),
});

const mapOpponent = (payload: any): ContestUserStatisticsOpponent => ({
  opponent: payload?.opponent ?? payload?.opponent_username ?? payload?.username ?? '',
  type: payload?.type ?? payload?.opponent_type ?? '',
  sharedCount: toNumber(payload?.sharedCount ?? payload?.shared_count ?? payload?.contests?.length),
  userWins: toNumber(payload?.userWins ?? payload?.user_wins ?? payload?.wins),
  opponentWins: toNumber(payload?.opponentWins ?? payload?.opponent_wins ?? payload?.losses),
  contests: (payload?.contests ?? []).map(mapOpponentContest),
});

export const mapContestUserStatistics = (payload: any): ContestUserStatistics => {
  const generalPayload =
    payload?.general ?? payload?.generalStats ?? payload?.general_statistics ?? null;
  const overviewPayload =
    payload?.overview ?? payload?.overviewStats ?? payload?.overview_statistics ?? null;
  const ranksPayload = payload?.contestRanks ?? payload?.contest_ranks ?? payload?.ranks ?? null;
  const deltasPayload =
    payload?.contestDeltas ?? payload?.contest_deltas ?? payload?.deltas ?? null;

  return {
    general: generalPayload ? mapGeneral(generalPayload) : null,
    overview: overviewPayload ? mapOverview(overviewPayload) : null,
    contestRanks: ranksPayload ? mapContestRanks(ranksPayload) : null,
    contestDeltas: deltasPayload ? mapContestDeltas(deltasPayload) : null,
    unsolvedProblems: (payload?.unsolvedProblems ?? payload?.unsolved_problems ?? []).map(
      mapUnsolvedProblem,
    ),
    languages: (payload?.languages ?? []).map(mapLanguage),
    verdicts: (payload?.verdicts ?? []).map(mapVerdict),
    tags: (payload?.tags ?? []).slice(0, 10).map(mapTag),
    symbols: (payload?.symbols ?? []).slice(0, 12).map(mapSymbol),
    timeline: (payload?.timeline ?? []).map(mapTimelineEntry),
    topAttempts: (payload?.topAttempts ?? payload?.top_attempts ?? []).map(mapTopAttempt),
    worthyOpponents: (payload?.worthyOpponents ?? payload?.opponents ?? []).map(mapOpponent),
  };
};

export const mapContestRatingChange = (payload: any): ContestRatingChange => ({
  contestId: toNumber(
    payload?.contestId ??
      payload?.contest_id ??
      payload?.contest?.id ??
      payload?.contestIdExact ??
      payload?.contest,
  ),
  contestStartDate:
    payload?.contestStartDate ??
    payload?.contest_start_date ??
    payload?.date ??
    payload?.created ??
    payload?.started_at,
  contestTitle:
    payload?.contestTitle ??
    payload?.contest_title ??
    payload?.title ??
    payload?.contest?.title ??
    '',
  newRating: toNumber(payload?.newRating ?? payload?.new_rating ?? payload?.rating ?? payload?.value),
  newRatingTitle: payload?.newRatingTitle ?? payload?.new_rating_title ?? payload?.ratingTitle ?? '',
  delta: toNumber(payload?.delta ?? payload?.ratingDelta ?? payload?.change ?? payload?.diff),
  rank: toNumber(payload?.rank ?? payload?.contest_rank ?? payload?.place ?? payload?.position),
});

export const contestStatisticsMappers = {
  mapContestUserStatistics,
  mapContestRatingChange,
};

const mapStatisticsContestant = (payload: any): ContestStatisticsContestant => ({
  username: payload?.username ?? payload?.user?.username ?? '',
  fullName: payload?.userFullName ?? payload?.fullName ?? payload?.user?.fullName ?? null,
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? payload?.user?.ratingTitle,
  teamName: payload?.team?.name ?? payload?.teamName ?? undefined,
  teamMembers: (payload?.team?.members ?? payload?.teamMembers ?? []).map(
    (member: any): ContestantTeamMember => ({
      username: member?.username ?? member?.user ?? '',
      rating: member?.rating !== undefined ? toNumber(member.rating) : undefined,
      ratingTitle: member?.ratingTitle ?? member?.rating_title ?? undefined,
      newRating: member?.newRating !== undefined ? toNumber(member.newRating) : undefined,
      newRatingTitle: member?.newRatingTitle ?? member?.new_rating_title ?? undefined,
    }),
  ),
  avatar: payload?.avatar ?? payload?.user?.avatar,
});

const mapStatisticsSummary = (payload: any): ContestStatisticsSummary => ({
  total: toNumber(payload?.total ?? payload?.count),
  byProblem: payload?.byProblem ?? payload?.by_problem ?? payload?.problems ?? {},
});

const mapStatisticsVerdicts = (payload: any): ContestStatisticsVerdicts => ({
  accepted: toNumber(payload?.accepted),
  wrongAnswer: toNumber(payload?.wrongAnswer ?? payload?.wrong_answer),
  timeLimitExceeded: toNumber(payload?.timeLimitExceeded ?? payload?.time_limit_exceeded),
  other: toNumber(payload?.other),
});

const mapStatisticsTimelineEntry = (payload: any): ContestStatisticsTimelineEntry => ({
  range: payload?.range ?? payload?.label ?? '',
  attempts: toNumber(payload?.attempts ?? payload?.count),
});

const mapStatisticsFirstSolve = (payload: any): ContestStatisticsFirstSolve => ({
  contestant: mapStatisticsContestant(payload?.contestant ?? payload?.user ?? payload),
  contestTimeSeconds: toNumber(
    payload?.contestTimeSeconds ?? payload?.contest_time_seconds ?? payload?.time_seconds,
  ),
  time: payload?.time ?? payload?.contestTime ?? payload?.contest_time ?? '',
  timestamp: payload?.timestamp ?? payload?.created ?? payload?.created_at ?? '',
});

const mapStatisticsBadge = (payload: any): ContestStatisticsBadgeEntry => ({
  contestant: payload?.contestant ? mapStatisticsContestant(payload.contestant) : null,
  problem: payload?.problem ?? payload?.problemSymbol ?? payload?.problem_symbol ?? undefined,
  time: payload?.time ?? payload?.contestTime ?? payload?.contest_time ?? undefined,
  attempts: payload?.attempts !== undefined ? toNumber(payload?.attempts) : undefined,
  solvedProblems:
    payload?.solvedProblems !== undefined ? toNumber(payload?.solvedProblems) : undefined,
  wrongAttempts:
    payload?.wrongAttempts !== undefined ? toNumber(payload?.wrongAttempts) : undefined,
});

const mapStatisticsBadges = (payload: any) => ({
  sniper: payload?.sniper ? mapStatisticsBadge(payload.sniper) : undefined,
  grinder: payload?.grinder ? mapStatisticsBadge(payload.grinder) : undefined,
  optimizer: payload?.optimizer ? mapStatisticsBadge(payload.optimizer) : undefined,
  neverGiveUp: payload?.neverGiveUp ? mapStatisticsBadge(payload.neverGiveUp) : undefined,
});

export const mapContestStatistics = (payload: any): ContestStatistics => ({
  general: {
    participants: toNumber(
      payload?.general?.participants ??
        payload?.participants ??
        payload?.general?.participantsCount ??
        payload?.general?.participants_count,
    ),
    attempts: mapStatisticsSummary(payload?.general?.attempts ?? payload?.attempts ?? {}),
    accepted: mapStatisticsSummary(payload?.general?.accepted ?? payload?.accepted ?? {}),
    acceptanceRate: toNumber(
      payload?.general?.acceptanceRate ??
        payload?.general?.acceptance_rate ??
        payload?.acceptanceRate ??
        payload?.acceptance_rate,
    ),
  },
  timeline: (payload?.timeline ?? []).map(mapStatisticsTimelineEntry),
  verdicts: mapStatisticsVerdicts(payload?.verdicts ?? {}),
  firstSolves: Object.entries(payload?.firstSolves ?? payload?.first_solves ?? {}).reduce<
    Record<string, ContestStatisticsFirstSolve>
  >((acc, [key, value]) => {
    acc[key] = mapStatisticsFirstSolve(value);
    return acc;
  }, {}),
  badges: mapStatisticsBadges(payload?.badges ?? {}),
  facts: Array.isArray(payload?.facts) ? payload.facts : [],
});

export const contestDetailsStatisticsMappers = {
  mapContestStatistics,
};
