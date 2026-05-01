export interface ChallengePlayer {
  username: string;
  avatar?: string;
  result: number;
  results: number[];
  rating: number;
  newRating: number;
  rankTitle: string;
  newRankTitle: string;
  delta: number;
}
