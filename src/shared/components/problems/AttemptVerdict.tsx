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
  const shortTitle = verdict === Verdicts.PartialSolution ? ballLabel : shortTitleRaw;
  const showTestCase =
    typeof testCaseNumber === 'number' &&
    testCaseNumber > 0 &&
    !(hideTestCaseFor as number[]).includes((verdict ?? 0) as number);

  const label = useMemo(() => {
    const parts = [shortTitle];
    if (showTestCase) parts.push(`#${testCaseNumber}`);
    return parts.join(' ').trim();
  }, [shortTitle, ballLabel, showTestCase, testCaseNumber, verdict]);

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
