import RatioScoreProblemResult from './RatioScoreProblemResult';
import type { ContestantProblemResultProps } from './types';

const MultiLanguageProblemResult = (props: ContestantProblemResultProps) => (
  <RatioScoreProblemResult {...props} color="info" />
);

export default MultiLanguageProblemResult;
