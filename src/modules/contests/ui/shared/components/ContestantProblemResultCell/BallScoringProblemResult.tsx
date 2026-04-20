import { contestHasBalls, formatContestPoints } from 'modules/contests/utils/contestType';
import { emptyResult, solvedResult } from './helpers';
import ProblemResultLayout from './ProblemResultLayout';
import type { ContestantProblemResultProps } from './types';

const BallScoringProblemResult = ({ contestType, typeInfo, info }: ContestantProblemResultProps) => {
  if (!info) return null;

  if (contestHasBalls(contestType, typeInfo)) {
    if (info.firstAcceptedTime) {
      return (
        <ProblemResultLayout
          result={solvedResult(info, formatContestPoints(info.points), 'primary', info.contestTime)}
        />
      );
    }

    if (info.points > 0) {
      return (
        <ProblemResultLayout
          result={{ label: formatContestPoints(info.points), color: 'warning' }}
        />
      );
    }

    return (
      <ProblemResultLayout
        result={{
          label: info.points !== undefined ? formatContestPoints(info.points) : '-',
          color: 'error',
        }}
      />
    );
  }

  return <ProblemResultLayout result={emptyResult} />;
};

export default BallScoringProblemResult;
