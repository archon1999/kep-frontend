export const giveawayKeys = {
  detail: (id: string, username: string) => ['giveaway', id, username] as const,
  list: (source: string, id: string | number, username: string) =>
    ['giveaways', source, id, username] as const,
};
