const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

export const getWorkspaceErrorMessage = (error: unknown, fallback: string) => {
  const record = asRecord(error);
  const message = asRecord(asRecord(record.response).data).message ?? record.message;
  return typeof message === 'string' && message ? message : fallback;
};
