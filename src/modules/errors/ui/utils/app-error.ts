export type AppErrorKind = 'stale-client' | 'unexpected';

const STALE_CLIENT_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk [\w-]+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /Unable to preload CSS/i,
];

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const maybeMessage = 'message' in error ? error.message : undefined;
    const maybeStatusText = 'statusText' in error ? error.statusText : undefined;

    if (typeof maybeMessage === 'string') {
      return maybeMessage;
    }

    if (typeof maybeStatusText === 'string') {
      return maybeStatusText;
    }
  }

  return '';
};

export const resolveAppErrorKind = (error: unknown): AppErrorKind => {
  const message = getErrorMessage(error);

  if (STALE_CLIENT_PATTERNS.some((pattern) => pattern.test(message))) {
    return 'stale-client';
  }

  return 'unexpected';
};
