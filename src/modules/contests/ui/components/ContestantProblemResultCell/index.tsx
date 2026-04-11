import { contestHasBalls } from '../../../utils/contestType';
import AcmStyleProblemResult from './AcmStyleProblemResult';
import BallScoringProblemResult from './BallScoringProblemResult';
import resultComponents from './registry';
import type { ContestantProblemResultProps } from './types';

const ContestantProblemResultCell = (props: ContestantProblemResultProps) => {
  const Renderer = props.contestType ? resultComponents[props.contestType] : undefined;
  const FallbackRenderer = contestHasBalls(props.contestType, props.typeInfo)
    ? BallScoringProblemResult
    : AcmStyleProblemResult;

  const Component = Renderer ?? FallbackRenderer;
  return <Component {...props} />;
};

export default ContestantProblemResultCell;
