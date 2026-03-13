export interface ArenaChallengePlayer {
  username: string;
  rankTitle: string;
  rating: number;
  result: number;
  results: number[];
}

export interface ArenaChallenge {
  id: number;
  playerFirst: ArenaChallengePlayer;
  playerSecond: ArenaChallengePlayer;
  finished: string | null;
  questionsCount: number;
  timeSeconds: number;
  rated: boolean;
}
