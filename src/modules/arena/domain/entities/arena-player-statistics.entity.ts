export interface ArenaPlayerStatistics {
  username: string;
  avatar?: string;
  rating: number;
  rankTitle: string;
  performance: number;
  challenges: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  opponents: Array<{
    username: string;
    avatar?: string;
    rankTitle?: string;
    rating?: number;
    result: number;
    playerScore: number;
    opponentScore: number;
  }>;
}
