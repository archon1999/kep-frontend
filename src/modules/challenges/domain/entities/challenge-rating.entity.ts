export interface ChallengeRatingRow {
  rowIndex: number;
  username: string;
  avatar?: string;
  rating: number;
  rankTitle: string;
  wins: number;
  draws: number;
  losses: number;
  all: number;
}
