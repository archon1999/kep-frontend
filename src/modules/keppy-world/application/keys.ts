export const worldKeys = {
  bootstrap: (username: string) => ['keppy-world', 'bootstrap', username] as const,
  leaderboard: (period: string, username?: string) => ['keppy-world', 'leaderboard', period, username ?? 'guest'] as const,
};
