import type { RunRequest, RunResult, RunnerLanguage } from '../entities';

export interface PlaygroundRepository {
  languages(): Promise<RunnerLanguage[]>;
  run(request: RunRequest, signal: AbortSignal): Promise<RunResult>;
  result(id: string, signal: AbortSignal): Promise<RunResult>;
}
