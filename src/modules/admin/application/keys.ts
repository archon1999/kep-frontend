export const adminKeys = {
  registry: (locale: string) => ['admin-console', locale, 'registry'] as const,
  dashboard: (locale: string) => ['admin-console', locale, 'dashboard'] as const,
  list: (locale: string, key: string, query: unknown) =>
    ['admin-console', locale, 'list', key, query] as const,
  detail: (locale: string, key: string, id?: string) =>
    ['admin-console', locale, 'detail', key, id ?? 'new'] as const,
};
