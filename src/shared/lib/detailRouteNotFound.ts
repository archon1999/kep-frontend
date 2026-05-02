export const getErrorStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  if (typeof status === 'number') {
    return status;
  }

  const responseStatus = (error as { response?: { status?: unknown } }).response?.status;
  return typeof responseStatus === 'number' ? responseStatus : undefined;
};

export const isNotFoundError = (error: unknown) => getErrorStatus(error) === 404;
