import { useMemo } from 'react';
import { Chip, ChipProps, Tooltip } from '@mui/material';
import {
  VerdictKey,
  Verdicts,
  formatBallsLabel,
  hideTestCaseFor,
  verdictColorMap,
  verdictShortTitle,
} from './attemptVerdict.utils';

interface AttemptVerdictProps extends Omit<ChipProps, 'label' | 'color'> {
  verdict?: VerdictKey;
  title: string;
  testCaseNumber?: number | null;
  balls?: number | null;
}

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
  const ballLabel = useMemo(() => formatBallsLabel(balls), [balls]);
  const fallbackTitle = title.trim() ? title.trim().slice(0, 3).toUpperCase() : '?';
  const shortTitle =
    verdict === Verdicts.PartialSolution ? (ballLabel ?? shortTitleRaw) : shortTitleRaw;
  const showTestCase =
    typeof testCaseNumber === 'number' &&
    testCaseNumber > 0 &&
    !(hideTestCaseFor as number[]).includes((verdict ?? 0) as number);

  const label = useMemo(() => {
    const parts = [shortTitle];
    if (showTestCase) parts.push(`#${testCaseNumber}`);
    return parts.join(' ').trim() || fallbackTitle;
  }, [shortTitle, fallbackTitle, showTestCase, testCaseNumber]);

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
