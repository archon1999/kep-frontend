export interface ArenaPlayer {
  username: string;
  avatar?: string;
  rankTitle: string;
  rating: number;
  rank?: number | null;
  points: number;
  performance: number | null;
  averageOpponentRating: number;
  streak: boolean;
  results: number[];
  isBot: boolean;
}
