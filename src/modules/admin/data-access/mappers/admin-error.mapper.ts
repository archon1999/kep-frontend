import { AdminFailure } from 'modules/admin/domain/utils/validation';

export const mapAdminFailure = (error: unknown): AdminFailure => {
  if (error instanceof AdminFailure) return error;
  const failure = error as {
    status?: number;
    data?: unknown;
    response?: { status?: number; data?: unknown };
  };
  const data = failure?.data ?? failure?.response?.data;
  const issues =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : { message: data ?? (error instanceof Error ? error.message : '') };
  return new AdminFailure(failure?.status ?? failure?.response?.status ?? 0, issues);
};
