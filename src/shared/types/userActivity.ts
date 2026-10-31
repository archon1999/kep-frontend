export interface UserActivityStat {
  series: number[];
  total: number;
  diff: number;
  percentage: number;
}

export interface UserActivityStatistics {
  newUsers: UserActivityStat;
  activeUsers: UserActivityStat;
}
