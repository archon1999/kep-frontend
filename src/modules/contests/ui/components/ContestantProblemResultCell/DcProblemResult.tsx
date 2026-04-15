import OptimizedScoreProblemResult from './OptimizedScoreProblemResult';
import type { ContestantProblemResultProps } from './types';

const DcProblemResult = (props: ContestantProblemResultProps) => (
  <OptimizedScoreProblemResult {...props} />
);

export default DcProblemResult;
