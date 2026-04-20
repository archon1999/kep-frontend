import { solvedResult } from './helpers';
import ProblemResultLayout from './ProblemResultLayout';
import type { ContestantProblemResultProps } from './types';

const OptimizedScoreProblemResult = ({ info }: ContestantProblemResultProps) => {
  if (!info) return null;
  if (info.firstAcceptedTime) {
    return <ProblemResultLayout result={solvedResult(info, `${info.points}`, 'success')} />;
  }
  return <ProblemResultLayout result={{ label: '-', color: 'error' }} />;
};

export default OptimizedScoreProblemResult;
