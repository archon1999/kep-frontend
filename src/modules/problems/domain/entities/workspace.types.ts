import type { Verdicts } from './problem.entity';

export interface SampleTestResult {
  verdict?: Verdicts;
  verdictTitle?: string;
  input?: string;
  output?: string;
  answer?: string;
}

export interface CustomTestResult {
  output?: string;
  error?: string;
  time?: number;
  memory?: number;
}

export interface AnswerForInputResult {
  answer?: string;
}

export type WorkspaceEditorTab = 'console' | 'samples';
