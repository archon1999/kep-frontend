import { ChipProps } from '@mui/material';

export enum Verdicts {
  InQueue = -2,
  Running,
  JudgementFailed,
  Accepted,
  WrongAnswer,
  TimeLimitExceeded,
  RuntimeError,
  OutputFormatError,
  MemoryLimitExceeded,
  Rejected,
  CompilationError,
  CommandExecutingError,
  IdlenessLimitExceeded,
  SyntaxError,
  CheckerNotFound,
  OnlyPython,
  ObjectNotFound,
  FakeAccepted,
  PartialSolution,
  NotAvailableLanguage,
}

export type VerdictKey = Verdicts;

export const verdictColorMap: Record<VerdictKey, ChipProps['color']> = {
  [Verdicts.InQueue]: 'warning',
  [Verdicts.Running]: 'secondary',
  [Verdicts.JudgementFailed]: 'default',
  [Verdicts.Accepted]: 'success',
  [Verdicts.WrongAnswer]: 'error',
  [Verdicts.TimeLimitExceeded]: 'error',
  [Verdicts.RuntimeError]: 'error',
  [Verdicts.OutputFormatError]: 'warning',
  [Verdicts.MemoryLimitExceeded]: 'error',
  [Verdicts.Rejected]: 'error',
  [Verdicts.CompilationError]: 'error',
  [Verdicts.CommandExecutingError]: 'error',
  [Verdicts.IdlenessLimitExceeded]: 'error',
  [Verdicts.SyntaxError]: 'error',
  [Verdicts.CheckerNotFound]: 'default',
  [Verdicts.OnlyPython]: 'default',
  [Verdicts.ObjectNotFound]: 'default',
  [Verdicts.PartialSolution]: 'warning',
  [Verdicts.NotAvailableLanguage]: 'default',
  [Verdicts.FakeAccepted]: 'success',
};

export const verdictShortTitle: Record<VerdictKey, string> = {
  [Verdicts.InQueue]: 'InQ',
  [Verdicts.Running]: 'Run',
  [Verdicts.JudgementFailed]: 'JF',
  [Verdicts.Accepted]: 'AC',
  [Verdicts.WrongAnswer]: 'WA',
  [Verdicts.TimeLimitExceeded]: 'TL',
  [Verdicts.RuntimeError]: 'RE',
  [Verdicts.OutputFormatError]: 'PE',
  [Verdicts.MemoryLimitExceeded]: 'ML',
  [Verdicts.Rejected]: 'RJ',
  [Verdicts.CompilationError]: 'CE',
  [Verdicts.CommandExecutingError]: 'CEE',
  [Verdicts.IdlenessLimitExceeded]: 'IL',
  [Verdicts.SyntaxError]: 'SE',
  [Verdicts.CheckerNotFound]: 'CNF',
  [Verdicts.OnlyPython]: 'PY',
  [Verdicts.ObjectNotFound]: 'ONF',
  [Verdicts.PartialSolution]: 'PS',
  [Verdicts.NotAvailableLanguage]: 'NAL',
  [Verdicts.FakeAccepted]: 'AC',
};

export const hideTestCaseFor: VerdictKey[] = [
  Verdicts.Accepted,
  Verdicts.InQueue,
  Verdicts.JudgementFailed,
  Verdicts.Rejected,
  Verdicts.CheckerNotFound,
  Verdicts.OnlyPython,
  Verdicts.PartialSolution,
  Verdicts.FakeAccepted,
];

export const formatBallScore = (balls?: number | null) => {
  if (balls === undefined || balls === null) return undefined;
  if (Number.isInteger(balls)) return String(balls);
  return balls.toFixed(2).replace(/\.?0+$/, '');
};

export const formatBallsLabel = (value?: number | null) => {
  const formatted = formatBallScore(value);
  return formatted ? `${formatted} ball` : undefined;
};

export const formatGroupLabel = (id?: string) => {
  const raw = String(id ?? '').trim();
  const match = raw.match(/^[gG](\d+)$/);
  if (match) return `Guruh ${match[1]}`;
  return raw ? `Guruh ${raw}` : 'Guruh';
};

export const formatSubtaskLabel = (id?: string) => {
  const raw = String(id ?? '').trim();
  const match = raw.match(/^[sS](\d+)$/);
  if (match) return `Subtask ${match[1]}`;
  return raw ? `Subtask ${raw}` : 'Subtask';
};
