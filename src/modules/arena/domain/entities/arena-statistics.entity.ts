export interface ArenaStatisticsLeader {
  username: string;
  value: number;
  minChallenges?: number;
}

export interface ArenaStatistics {
  participants: number;
  averageRating: number;
  challenges: number;
  longestWinStreak?: ArenaStatisticsLeader | null;
  mostChallengesPlayed?: ArenaStatisticsLeader | null;
  highestPerformance?: ArenaStatisticsLeader | null;
  highestWinRate?: ArenaStatisticsLeader | null;
}
