import AcmStyleProblemResult from './AcmStyleProblemResult';
import type { ContestantProblemResultProps } from './types';

const OneAttemptProblemResult = (props: ContestantProblemResultProps) => (
  <AcmStyleProblemResult {...props} />
);

export default OneAttemptProblemResult;
