export const worldKeys = {
  bootstrap: (username: string) => ['keppy-world', 'bootstrap', username] as const,
  leaderboard: (period: string, username?: string, page = 1) =>
    ['keppy-world', 'leaderboard', period, username ?? 'guest', page] as const,
};
