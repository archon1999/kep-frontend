type ErrorMessages = {
  message?: unknown;
  detail?: unknown;
  error?: unknown;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  const requestError = error as {
    data?: unknown;
    response?: { data?: unknown };
    message?: unknown;
  };
  const payload = requestError.data ?? requestError.response?.data;
  const messages = payload && typeof payload === 'object' ? (payload as ErrorMessages) : undefined;

  return (
    [messages?.message, messages?.detail, messages?.error, requestError.message].find(
      (message): message is string => typeof message === 'string' && Boolean(message.trim()),
    ) ?? fallback
  );
};
