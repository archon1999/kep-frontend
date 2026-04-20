import RatioScoreProblemResult from './RatioScoreProblemResult';
import type { ContestantProblemResultProps } from './types';

const LessLineProblemResult = (props: ContestantProblemResultProps) => (
  <RatioScoreProblemResult {...props} color="primary" />
);

export default LessLineProblemResult;
