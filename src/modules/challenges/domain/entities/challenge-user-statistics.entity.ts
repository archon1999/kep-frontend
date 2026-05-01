export interface ChallengeStatisticsGeneral {
  currentRating: number;
  rankTitle: string;
  bestRating: number;
  bestRatingAt: string | null;
  worstRating: number;
  worstRatingAt: string | null;
  ratingPlace: number | null;
  playersCount: number;
  totalChallenges: number;
  ratedChallenges: number;
  unratedChallenges: number;
  arenaChallenges: number;
  humanChallenges: number;
  botChallenges: number;
}

export interface ChallengeStatisticsResults {
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  questionsSeen: number;
  questionsSolved: number;
  solveRate: number;
  averageSolvedPerChallenge: number;
  perfectChallenges: number;
  cleanSweepWins: number;
  onePointWins: number;
  onePointLosses: number;
}

export interface ChallengeStatisticsActivityHeatmapEntry {
  date: string;
  count: number;
}

export interface ChallengeStatisticsActivityBucket {
  count: number;
  winRate: number;
}

export interface ChallengeStatisticsByWeekday extends ChallengeStatisticsActivityBucket {
  weekday: number;
}

export interface ChallengeStatisticsByHour extends ChallengeStatisticsActivityBucket {
  hour: number;
}

export interface ChallengeStatisticsLastDaysEntry {
  date: string;
  count: number;
}

export interface ChallengeStatisticsActivity {
  heatmap: ChallengeStatisticsActivityHeatmapEntry[];
  byWeekday: ChallengeStatisticsByWeekday[];
  byHour: ChallengeStatisticsByHour[];
  last30Days: ChallengeStatisticsLastDaysEntry[];
}

export interface ChallengeStatisticsFormatRow {
  count: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  averageSolved: number;
}

export interface ChallengeStatisticsTimeControlRow extends ChallengeStatisticsFormatRow {
  timeSeconds: number;
  label: string;
}

export interface ChallengeStatisticsQuestionTimeTypeRow extends ChallengeStatisticsFormatRow {
  questionTimeType: number;
}

export interface ChallengeStatisticsQuestionsCountRow extends ChallengeStatisticsFormatRow {
  questionsCount: number;
}

export interface ChallengeStatisticsFormats {
  byTimeControl: ChallengeStatisticsTimeControlRow[];
  byQuestionTimeType: ChallengeStatisticsQuestionTimeTypeRow[];
  byQuestionsCount: ChallengeStatisticsQuestionsCountRow[];
}

export interface ChallengeStatisticsSeenSolvedRow {
  seen: number;
  solved: number;
}

export interface ChallengeStatisticsDifficultyRow extends ChallengeStatisticsSeenSolvedRow {
  difficulty: number;
}

export interface ChallengeStatisticsQuestionTypeRow extends ChallengeStatisticsSeenSolvedRow {
  questionType: number;
}

export interface ChallengeStatisticsChapterRow extends ChallengeStatisticsSeenSolvedRow {
  chapterId: number;
  title: string;
}

export interface ChallengeStatisticsDistribution {
  byDifficulty: ChallengeStatisticsDifficultyRow[];
  byQuestionType: ChallengeStatisticsQuestionTypeRow[];
  byChapter: ChallengeStatisticsChapterRow[];
}

export interface ChallengeStatisticsStreak {
  count: number;
  startAt: string | null;
  endAt: string | null;
}

export interface ChallengeStatisticsRatingRecord {
  challengeId: number;
  finishedAt: string | null;
  delta: number;
  ratingAfter?: number;
  opponentUsername: string;
  opponentRating: number;
  result: string;
}

export interface ChallengeStatisticsMatchRecord extends ChallengeStatisticsRatingRecord {
  userScore: number;
  opponentScore: number;
  margin: number;
  rated: boolean;
  isArena: boolean;
  timeSeconds: number;
  questionsCount: number;
  questionTimeType: number;
}

export interface ChallengeStatisticsRecords {
  biggestGain: ChallengeStatisticsRatingRecord | null;
  biggestDrop: ChallengeStatisticsRatingRecord | null;
  bestVictory: ChallengeStatisticsMatchRecord | null;
  worstDefeat: ChallengeStatisticsMatchRecord | null;
  longestWinStreak: ChallengeStatisticsStreak;
  currentWinStreak: ChallengeStatisticsStreak;
  longestLossStreak: ChallengeStatisticsStreak;
  currentLossStreak: ChallengeStatisticsStreak;
  mostDominantWin: ChallengeStatisticsMatchRecord | null;
  mostPainfulLoss: ChallengeStatisticsMatchRecord | null;
}

export interface ChallengeStatisticsOpponentBreakdown {
  bucket: string;
  count: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
}

export interface ChallengeStatisticsOpponentHistoryEntry {
  challengeId: number;
  finishedAt: string | null;
  result: string;
  userScore: number;
  opponentScore: number;
}

export interface ChallengeStatisticsOpponentRow {
  username: string;
  count: number;
  wins: number;
  draws: number;
  losses: number;
  averageOpponentRating: number;
  lastPlayedAt: string | null;
  history?: ChallengeStatisticsOpponentHistoryEntry[];
}

export interface ChallengeStatisticsOpponents {
  averageOpponentRating: number;
  vsHigherRated: ChallengeStatisticsOpponentBreakdown;
  vsSameRated: ChallengeStatisticsOpponentBreakdown;
  vsLowerRated: ChallengeStatisticsOpponentBreakdown;
  mostPlayedOpponents: ChallengeStatisticsOpponentRow[];
  bestVictories: ChallengeStatisticsMatchRecord[];
  worstDefeats: ChallengeStatisticsMatchRecord[];
  rivals: ChallengeStatisticsOpponentRow[];
}

export interface ChallengeRatingHistoryEntry {
  challengeId: number;
  finishedAt: string | null;
  ratingAfter: number;
  delta: number;
  opponentUsername: string;
  opponentRating: number;
  result: string;
  userScore: number;
  opponentScore: number;
}

export interface ChallengeUserStatistics {
  general: ChallengeStatisticsGeneral | null;
  results: ChallengeStatisticsResults | null;
  activity: ChallengeStatisticsActivity | null;
  formats: ChallengeStatisticsFormats | null;
  distribution: ChallengeStatisticsDistribution | null;
  records: ChallengeStatisticsRecords | null;
  opponents: ChallengeStatisticsOpponents | null;
  ratingHistory: ChallengeRatingHistoryEntry[];
}
