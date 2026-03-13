export interface ArenaPlayer {
  rowIndex: number;
  username: string;
  rankTitle: string;
  rating: string;
  points: number;
  streak: boolean;
  results: number[];
  isBot: boolean;
}
