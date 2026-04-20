import { emptyResult, solvedResult } from './helpers';
import ProblemResultLayout from './ProblemResultLayout';
import type { ContestantProblemResultProps } from './types';

const AcmStyleProblemResult = ({ info }: ContestantProblemResultProps) => {
  if (!info) return null;

  if (info.firstAcceptedTime) {
    const attempts = info.attemptsCount > 0 ? `+${info.attemptsCount}` : '+';
    return <ProblemResultLayout result={solvedResult(info, attempts, 'success', info.contestTime)} />;
  }

  if (info.attemptsCount > 0) {
    return <ProblemResultLayout result={{ label: `-${info.attemptsCount}`, color: 'error' }} />;
  }

  return <ProblemResultLayout result={emptyResult} />;
};

export default AcmStyleProblemResult;
