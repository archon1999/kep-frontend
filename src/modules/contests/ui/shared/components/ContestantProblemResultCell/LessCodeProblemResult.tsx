import OptimizedScoreProblemResult from './OptimizedScoreProblemResult';
import type { ContestantProblemResultProps } from './types';

const LessCodeProblemResult = (props: ContestantProblemResultProps) => (
  <OptimizedScoreProblemResult {...props} />
);

export default LessCodeProblemResult;
