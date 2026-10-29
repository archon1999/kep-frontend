import type { RunRequest, RunResult } from '../entities';

export interface PlaygroundRepository {
  run(request: RunRequest, signal: AbortSignal): Promise<RunResult>;
  result(id: string, signal: AbortSignal): Promise<RunResult>;
}
