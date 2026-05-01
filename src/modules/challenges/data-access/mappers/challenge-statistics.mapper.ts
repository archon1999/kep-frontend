import {
  ChallengeRatingHistoryEntry,
  ChallengeStatisticsActivity,
  ChallengeStatisticsChapterRow,
  ChallengeStatisticsDifficultyRow,
  ChallengeStatisticsDistribution,
  ChallengeStatisticsFormats,
  ChallengeStatisticsGeneral,
  ChallengeStatisticsMatchRecord,
  ChallengeStatisticsOpponentBreakdown,
  ChallengeStatisticsOpponentRow,
  ChallengeStatisticsOpponents,
  ChallengeStatisticsQuestionTypeRow,
  ChallengeStatisticsRatingRecord,
  ChallengeStatisticsRecords,
  ChallengeStatisticsResults,
  ChallengeStatisticsStreak,
  ChallengeUserStatistics,
} from '../../domain';

const toNumber = (value: any): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapGeneral = (payload: any): ChallengeStatisticsGeneral => ({
  currentRating: toNumber(payload?.currentRating ?? payload?.current_rating),
  rankTitle: payload?.rankTitle ?? payload?.rank_title ?? '',
  bestRating: toNumber(payload?.bestRating ?? payload?.best_rating),
  bestRatingAt: payload?.bestRatingAt ?? payload?.best_rating_at ?? null,
  worstRating: toNumber(payload?.worstRating ?? payload?.worst_rating),
  worstRatingAt: payload?.worstRatingAt ?? payload?.worst_rating_at ?? null,
  ratingPlace:
    payload?.ratingPlace === null || payload?.rating_place === null
      ? null
      : toNumber(payload?.ratingPlace ?? payload?.rating_place),
  playersCount: toNumber(payload?.playersCount ?? payload?.players_count),
  totalChallenges: toNumber(payload?.totalChallenges ?? payload?.total_challenges),
  ratedChallenges: toNumber(payload?.ratedChallenges ?? payload?.rated_challenges),
  unratedChallenges: toNumber(payload?.unratedChallenges ?? payload?.unrated_challenges),
  arenaChallenges: toNumber(payload?.arenaChallenges ?? payload?.arena_challenges),
  humanChallenges: toNumber(payload?.humanChallenges ?? payload?.human_challenges),
  botChallenges: toNumber(payload?.botChallenges ?? payload?.bot_challenges),
});

const mapResults = (payload: any): ChallengeStatisticsResults => ({
  wins: toNumber(payload?.wins),
  draws: toNumber(payload?.draws),
  losses: toNumber(payload?.losses),
  winRate: toNumber(payload?.winRate ?? payload?.win_rate),
  drawRate: toNumber(payload?.drawRate ?? payload?.draw_rate),
  lossRate: toNumber(payload?.lossRate ?? payload?.loss_rate),
  questionsSeen: toNumber(payload?.questionsSeen ?? payload?.questions_seen),
  questionsSolved: toNumber(payload?.questionsSolved ?? payload?.questions_solved),
  solveRate: toNumber(payload?.solveRate ?? payload?.solve_rate),
  averageSolvedPerChallenge: toNumber(
    payload?.averageSolvedPerChallenge ?? payload?.average_solved_per_challenge,
  ),
  perfectChallenges: toNumber(payload?.perfectChallenges ?? payload?.perfect_challenges),
  cleanSweepWins: toNumber(payload?.cleanSweepWins ?? payload?.clean_sweep_wins),
  onePointWins: toNumber(payload?.onePointWins ?? payload?.one_point_wins),
  onePointLosses: toNumber(payload?.onePointLosses ?? payload?.one_point_losses),
});

const mapActivity = (payload: any): ChallengeStatisticsActivity => ({
  heatmap: (payload?.heatmap ?? []).map((item: any) => ({
    date: item?.date ?? '',
    count: toNumber(item?.count),
  })),
  byWeekday: (payload?.byWeekday ?? payload?.by_weekday ?? []).map((item: any) => ({
    weekday: toNumber(item?.weekday),
    count: toNumber(item?.count),
    winRate: toNumber(item?.winRate ?? item?.win_rate),
  })),
  byHour: (payload?.byHour ?? payload?.by_hour ?? []).map((item: any) => ({
    hour: toNumber(item?.hour),
    count: toNumber(item?.count),
    winRate: toNumber(item?.winRate ?? item?.win_rate),
  })),
  last30Days: (payload?.last30Days ?? payload?.last_30_days ?? []).map((item: any) => ({
    date: item?.date ?? '',
    count: toNumber(item?.count),
  })),
});

const mapFormatRow = (payload: any) => ({
  count: toNumber(payload?.count),
  wins: toNumber(payload?.wins),
  draws: toNumber(payload?.draws),
  losses: toNumber(payload?.losses),
  winRate: toNumber(payload?.winRate ?? payload?.win_rate),
  averageSolved: toNumber(payload?.averageSolved ?? payload?.average_solved),
});

const mapFormats = (payload: any): ChallengeStatisticsFormats => ({
  byTimeControl: (payload?.byTimeControl ?? payload?.by_time_control ?? []).map((item: any) => ({
    ...mapFormatRow(item),
    timeSeconds: toNumber(item?.timeSeconds ?? item?.time_seconds),
    label: item?.label ?? '',
  })),
  byQuestionTimeType: (payload?.byQuestionTimeType ?? payload?.by_question_time_type ?? []).map((item: any) => ({
    ...mapFormatRow(item),
    questionTimeType: toNumber(item?.questionTimeType ?? item?.question_time_type),
  })),
  byQuestionsCount: (payload?.byQuestionsCount ?? payload?.by_questions_count ?? []).map((item: any) => ({
    ...mapFormatRow(item),
    questionsCount: toNumber(item?.questionsCount ?? item?.questions_count),
  })),
});

const mapDifficultyRow = (payload: any): ChallengeStatisticsDifficultyRow => ({
  difficulty: toNumber(payload?.difficulty),
  seen: toNumber(payload?.seen),
  solved: toNumber(payload?.solved),
});

const mapQuestionTypeRow = (payload: any): ChallengeStatisticsQuestionTypeRow => ({
  questionType: toNumber(payload?.questionType ?? payload?.question_type),
  seen: toNumber(payload?.seen),
  solved: toNumber(payload?.solved),
});

const mapChapterRow = (payload: any): ChallengeStatisticsChapterRow => ({
  chapterId: toNumber(payload?.chapterId ?? payload?.chapter_id),
  title: payload?.title ?? '',
  seen: toNumber(payload?.seen),
  solved: toNumber(payload?.solved),
});

const mapDistribution = (payload: any): ChallengeStatisticsDistribution => ({
  byDifficulty: (payload?.byDifficulty ?? payload?.by_difficulty ?? []).map(mapDifficultyRow),
  byQuestionType: (payload?.byQuestionType ?? payload?.by_question_type ?? []).map(mapQuestionTypeRow),
  byChapter: (payload?.byChapter ?? payload?.by_chapter ?? []).map(mapChapterRow),
});

const mapStreak = (payload: any): ChallengeStatisticsStreak => ({
  count: toNumber(payload?.count),
  startAt: payload?.startAt ?? payload?.start_at ?? null,
  endAt: payload?.endAt ?? payload?.end_at ?? null,
});

const mapRatingRecord = (payload: any): ChallengeStatisticsRatingRecord => ({
  challengeId: toNumber(payload?.challengeId ?? payload?.challenge_id),
  finishedAt: payload?.finishedAt ?? payload?.finished_at ?? null,
  delta: toNumber(payload?.delta),
  ratingAfter:
    payload?.ratingAfter !== undefined || payload?.rating_after !== undefined
      ? toNumber(payload?.ratingAfter ?? payload?.rating_after)
      : undefined,
  opponentUsername: payload?.opponentUsername ?? payload?.opponent_username ?? '',
  opponentRating: toNumber(payload?.opponentRating ?? payload?.opponent_rating),
  result: payload?.result ?? '',
});

const mapMatchRecord = (payload: any): ChallengeStatisticsMatchRecord => ({
  ...mapRatingRecord(payload),
  userScore: toNumber(payload?.userScore ?? payload?.user_score),
  opponentScore: toNumber(payload?.opponentScore ?? payload?.opponent_score),
  margin: toNumber(payload?.margin),
  rated: Boolean(payload?.rated),
  isArena: Boolean(payload?.isArena ?? payload?.is_arena),
  timeSeconds: toNumber(payload?.timeSeconds ?? payload?.time_seconds),
  questionsCount: toNumber(payload?.questionsCount ?? payload?.questions_count),
  questionTimeType: toNumber(payload?.questionTimeType ?? payload?.question_time_type),
});

const mapRecords = (payload: any): ChallengeStatisticsRecords => ({
  biggestGain: payload?.biggestGain || payload?.biggest_gain ? mapRatingRecord(payload?.biggestGain ?? payload?.biggest_gain) : null,
  biggestDrop: payload?.biggestDrop || payload?.biggest_drop ? mapRatingRecord(payload?.biggestDrop ?? payload?.biggest_drop) : null,
  bestVictory: payload?.bestVictory || payload?.best_victory ? mapMatchRecord(payload?.bestVictory ?? payload?.best_victory) : null,
  worstDefeat: payload?.worstDefeat || payload?.worst_defeat ? mapMatchRecord(payload?.worstDefeat ?? payload?.worst_defeat) : null,
  longestWinStreak: mapStreak(payload?.longestWinStreak ?? payload?.longest_win_streak ?? {}),
  currentWinStreak: mapStreak(payload?.currentWinStreak ?? payload?.current_win_streak ?? {}),
  longestLossStreak: mapStreak(payload?.longestLossStreak ?? payload?.longest_loss_streak ?? {}),
  currentLossStreak: mapStreak(payload?.currentLossStreak ?? payload?.current_loss_streak ?? {}),
  mostDominantWin: payload?.mostDominantWin || payload?.most_dominant_win ? mapMatchRecord(payload?.mostDominantWin ?? payload?.most_dominant_win) : null,
  mostPainfulLoss: payload?.mostPainfulLoss || payload?.most_painful_loss ? mapMatchRecord(payload?.mostPainfulLoss ?? payload?.most_painful_loss) : null,
});

const mapOpponentBreakdown = (payload: any): ChallengeStatisticsOpponentBreakdown => ({
  bucket: payload?.bucket ?? '',
  count: toNumber(payload?.count),
  wins: toNumber(payload?.wins),
  draws: toNumber(payload?.draws),
  losses: toNumber(payload?.losses),
  winRate: toNumber(payload?.winRate ?? payload?.win_rate),
});

const mapOpponentRow = (payload: any): ChallengeStatisticsOpponentRow => ({
  username: payload?.username ?? '',
  count: toNumber(payload?.count),
  wins: toNumber(payload?.wins),
  draws: toNumber(payload?.draws),
  losses: toNumber(payload?.losses),
  averageOpponentRating: toNumber(payload?.averageOpponentRating ?? payload?.average_opponent_rating),
  lastPlayedAt: payload?.lastPlayedAt ?? payload?.last_played_at ?? null,
  history: (payload?.history ?? []).map((item: any) => ({
    challengeId: toNumber(item?.challengeId ?? item?.challenge_id),
    finishedAt: item?.finishedAt ?? item?.finished_at ?? null,
    result: item?.result ?? '',
    userScore: toNumber(item?.userScore ?? item?.user_score),
    opponentScore: toNumber(item?.opponentScore ?? item?.opponent_score),
  })),
});

const mapOpponents = (payload: any): ChallengeStatisticsOpponents => ({
  averageOpponentRating: toNumber(payload?.averageOpponentRating ?? payload?.average_opponent_rating),
  vsHigherRated: mapOpponentBreakdown(payload?.vsHigherRated ?? payload?.vs_higher_rated ?? {}),
  vsSameRated: mapOpponentBreakdown(payload?.vsSameRated ?? payload?.vs_same_rated ?? {}),
  vsLowerRated: mapOpponentBreakdown(payload?.vsLowerRated ?? payload?.vs_lower_rated ?? {}),
  mostPlayedOpponents: (payload?.mostPlayedOpponents ?? payload?.most_played_opponents ?? []).map(mapOpponentRow),
  bestVictories: (payload?.bestVictories ?? payload?.best_victories ?? []).map(mapMatchRecord),
  worstDefeats: (payload?.worstDefeats ?? payload?.worst_defeats ?? []).map(mapMatchRecord),
  rivals: (payload?.rivals ?? []).map(mapOpponentRow),
});

const mapRatingHistory = (payload: any): ChallengeRatingHistoryEntry => ({
  challengeId: toNumber(payload?.challengeId ?? payload?.challenge_id),
  finishedAt: payload?.finishedAt ?? payload?.finished_at ?? null,
  ratingAfter: toNumber(payload?.ratingAfter ?? payload?.rating_after),
  delta: toNumber(payload?.delta),
  opponentUsername: payload?.opponentUsername ?? payload?.opponent_username ?? '',
  opponentRating: toNumber(payload?.opponentRating ?? payload?.opponent_rating),
  result: payload?.result ?? '',
  userScore: toNumber(payload?.userScore ?? payload?.user_score),
  opponentScore: toNumber(payload?.opponentScore ?? payload?.opponent_score),
});

export const mapChallengeUserStatistics = (payload: any): ChallengeUserStatistics => ({
  general: payload?.general ? mapGeneral(payload.general) : null,
  results: payload?.results ? mapResults(payload.results) : null,
  activity: payload?.activity ? mapActivity(payload.activity) : null,
  formats: payload?.formats ? mapFormats(payload.formats) : null,
  distribution: payload?.distribution ? mapDistribution(payload.distribution) : null,
  records: payload?.records ? mapRecords(payload.records) : null,
  opponents: payload?.opponents ? mapOpponents(payload.opponents) : null,
  ratingHistory: (payload?.ratingHistory ?? payload?.rating_history ?? []).map(mapRatingHistory),
});

export const challengeStatisticsMappers = {
  mapChallengeUserStatistics,
};
