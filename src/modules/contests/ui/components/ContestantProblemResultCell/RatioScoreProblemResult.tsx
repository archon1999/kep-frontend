import { problemBallOrDefault, solvedResult } from './helpers';
import ProblemResultLayout from './ProblemResultLayout';
import type { ContestantProblemResultProps, ResultColor } from './types';

interface RatioScoreProblemResultProps extends ContestantProblemResultProps {
  color: ResultColor;
}

const RatioScoreProblemResult = ({ info, problem, color }: RatioScoreProblemResultProps) => {
  if (!info) return null;
  if (info.firstAcceptedTime) {
    return (
      <ProblemResultLayout
        result={solvedResult(info, `${info.points}/${problemBallOrDefault(problem)}`, color)}
      />
    );
  }
  return <ProblemResultLayout result={{ label: '-', color: 'error' }} />;
};

export default RatioScoreProblemResult;
