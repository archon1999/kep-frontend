import { useMemo } from 'react';
import { Chip, ChipProps, Tooltip } from '@mui/material';

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
  Hacked,
}

export type VerdictKey = Verdicts;

interface AttemptVerdictProps extends Omit<ChipProps, 'label' | 'color'> {
  verdict?: VerdictKey;
  title: string;
  testCaseNumber?: number | null;
  balls?: number | null;
}

const verdictColorMap: Record<VerdictKey, ChipProps['color']> = {
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
  [Verdicts.Hacked]: 'error',
};

const verdictShortTitle: Record<VerdictKey, string> = {
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
  [Verdicts.CheckerNotFound]: '',
  [Verdicts.OnlyPython]: '',
  [Verdicts.ObjectNotFound]: '',
  [Verdicts.PartialSolution]: '',
  [Verdicts.NotAvailableLanguage]: '',
  [Verdicts.FakeAccepted]: 'AC',
  [Verdicts.Hacked]: '',
};

const hideTestCaseFor: VerdictKey[] = [
  Verdicts.Accepted,
  Verdicts.InQueue,
  Verdicts.JudgementFailed,
  Verdicts.Rejected,
  Verdicts.CheckerNotFound,
  Verdicts.OnlyPython,
  Verdicts.PartialSolution,
  Verdicts.FakeAccepted,
  Verdicts.Hacked,
];

const AttemptVerdict = ({
  verdict,
  title,
  testCaseNumber,
  balls,
  ...rest
}: AttemptVerdictProps) => {
  const color =
    verdict !== undefined && verdictColorMap[verdict] ? verdictColorMap[verdict] : 'default';
  const shortTitleRaw = verdict !== undefined ? verdictShortTitle[verdict as VerdictKey] : '';
  const shortTitle = shortTitleRaw || title;
  const showTestCase =
    typeof testCaseNumber === 'number' &&
    testCaseNumber > 0 &&
    !(hideTestCaseFor as number[]).includes((verdict ?? 0) as number);
  const showBall = verdict === Verdicts.PartialSolution && balls !== undefined && balls !== null;

  const label = useMemo(() => {
    const parts = [shortTitle];
    if (showTestCase) parts.push(`#${testCaseNumber}`);
    if (showBall) parts.push(String(balls));
    return parts.join(' ').trim();
  }, [shortTitle, showTestCase, testCaseNumber, showBall, balls]);

  return (
    <Tooltip title={title}>
      <Chip
        size="medium"
        variant="outlined"
        color={color}
        label={label}
        sx={{ fontWeight: 700 }}
        {...rest}
      />
    </Tooltip>
  );
};

export default AttemptVerdict;
