import type { RunStatus } from '../enums';

export type Draft = { code: string; input: string };
export type RunRequest = Draft & { lang: string };
export type RunnerLanguage = {
  id: string;
  label: string;
  extension: string;
  editorLanguage: string;
  template: string;
  timeLimit: number;
  memoryLimit: number;
};
export type RunResult = {
  id: string;
  status: RunStatus;
  verdict?: number;
  output: string;
  error: string;
  time: number;
  memory: number;
};
