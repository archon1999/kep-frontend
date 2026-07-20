interface PendingResponse {
  pending?: boolean;
}

interface PollPendingResponseOptions {
  timeoutMs?: number;
  intervalMs?: number;
  wait?: (durationMs: number) => Promise<void>;
  now?: () => number;
}

const waitFor = (durationMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });

export const pollPendingResponse = async <T extends PendingResponse>(
  request: () => Promise<T>,
  options: PollPendingResponseOptions = {},
): Promise<T> => {
  const timeoutMs = Math.max(0, options.timeoutMs ?? 40_000);
  const intervalMs = Math.max(1, options.intervalMs ?? 1000);
  const wait = options.wait ?? waitFor;
  const now = options.now ?? Date.now;
  const startedAt = now();
  let response = await request();

  while (response.pending === true) {
    const remainingMs = timeoutMs - (now() - startedAt);

    if (remainingMs <= 0) {
      break;
    }

    await wait(Math.min(intervalMs, remainingMs));

    if (now() - startedAt >= timeoutMs) {
      break;
    }

    response = await request();
  }

  return response;
};
