import type { PlaygroundRepository, RunRequest, RunResult } from '../domain';

export const waitForPoll = (signal: AbortSignal, delay = 800) =>
  new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, delay);
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  });

export const executeRunJob = async (
  repository: PlaygroundRepository,
  request: RunRequest,
  signal: AbortSignal,
  onProgress: (result: RunResult) => void,
) => {
  signal.throwIfAborted();
  let result = await repository.run(request, signal);
  signal.throwIfAborted();
  onProgress(result);
  while (result.status === 'queued' || result.status === 'running') {
    await waitForPoll(signal);
    signal.throwIfAborted();
    result = await repository.result(result.id, signal);
    signal.throwIfAborted();
    onProgress(result);
  }
  return result;
};
