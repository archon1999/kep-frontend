import type { RunStatus } from '../enums';

export type RunRequest = { code: string; input: string };
export type RunResult = {
  id: string;
  status: RunStatus;
  verdict?: number;
  output: string;
  error: string;
  time: number;
  memory: number;
};
