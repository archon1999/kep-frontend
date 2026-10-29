export const playgroundKeys = {
  languages: ['playground', 'languages'] as const,
  result: (id: string) => ['playground', 'run', id] as const,
};
