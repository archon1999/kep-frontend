export interface ArenaPlayerStatistics {
  username: string;
  rankTitle: string;
  performance: number;
  challenges: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  opponents: Array<{ username: string; result: number }>;
}
