import { ComponentType } from 'react';
import { Stack, Typography } from '@mui/material';
import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  ContestProblemEntity,
  ContestProblemInfo,
} from '../../domain/entities/contest-problem.entity';
import { ContestTypeInfo } from '../../domain/entities/contest.entity';
import { contestHasBalls, formatContestPoints } from '../../utils/contestType';

type ResultColor = 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';

interface ContestantProblemResultProps {
  contestType?: ContestType | string;
  typeInfo?: ContestTypeInfo | null;
  info?: ContestProblemInfo | null;
  problem?: ContestProblemEntity;
}

interface ProblemResultView {
  label: string;
  color: ResultColor;
  helper?: string;
  isBest?: boolean;
}

const emptyResult: ProblemResultView = { label: '-', color: 'default' };

const solvedResult = (
  info: ContestProblemInfo,
  label: string,
  color: ResultColor = 'success',
  helper?: string | null,
): ProblemResultView => ({
  label,
  color,
  helper: helper ?? undefined,
  isBest: info.theBest,
});

const AcmProblemResult = ({ info }: ContestantProblemResultProps) => {
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

const Acm2hProblemResult = (props: ContestantProblemResultProps) => <AcmProblemResult {...props} />;
const Acm10mProblemResult = (props: ContestantProblemResultProps) => <AcmProblemResult {...props} />;
const Acm20mProblemResult = (props: ContestantProblemResultProps) => <AcmProblemResult {...props} />;
const IqProblemResult = (props: ContestantProblemResultProps) => <AcmProblemResult {...props} />;
const OneAttemptProblemResult = (props: ContestantProblemResultProps) => <AcmProblemResult {...props} />;

const OptimizedProblemResult = ({ info }: ContestantProblemResultProps) => {
  if (!info) return null;
  if (info.firstAcceptedTime) {
    return <ProblemResultLayout result={solvedResult(info, `${info.points}`, 'success')} />;
  }
  return <ProblemResultLayout result={{ label: '-', color: 'error' }} />;
};

const LessCodeProblemResult = (props: ContestantProblemResultProps) => <OptimizedProblemResult {...props} />;
const DcProblemResult = (props: ContestantProblemResultProps) => <OptimizedProblemResult {...props} />;

const RatioProblemResult = ({
  info,
  problem,
  color,
}: ContestantProblemResultProps & { color: ResultColor }) => {
  if (!info) return null;
  if (info.firstAcceptedTime) {
    return (
      <ProblemResultLayout
        result={solvedResult(info, `${info.points}/${problem?.ball ?? 10}`, color)}
      />
    );
  }
  return <ProblemResultLayout result={{ label: '-', color: 'error' }} />;
};

const LessLineProblemResult = (props: ContestantProblemResultProps) => (
  <RatioProblemResult {...props} color="primary" />
);

const MultiLanguageProblemResult = (props: ContestantProblemResultProps) => (
  <RatioProblemResult {...props} color="info" />
);

const BallProblemResult = ({ contestType, typeInfo, info }: ContestantProblemResultProps) => {
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

const IoiProblemResult = (props: ContestantProblemResultProps) => <BallProblemResult {...props} />;
const Ball525ProblemResult = (props: ContestantProblemResultProps) => <BallProblemResult {...props} />;
const Ball550ProblemResult = (props: ContestantProblemResultProps) => <BallProblemResult {...props} />;
const GenericBallProblemResult = (props: ContestantProblemResultProps) => <BallProblemResult {...props} />;
const CodeGolfProblemResult = (props: ContestantProblemResultProps) => <BallProblemResult {...props} />;
const ExamProblemResult = (props: ContestantProblemResultProps) => <BallProblemResult {...props} />;

const ProblemResultLayout = ({ result }: { result: ProblemResultView }) => (
  <Stack spacing={0.25} alignItems="center" width="100%">
    {result.isBest ? (
      <Stack
        spacing={0.25}
        justifyContent="center"
        alignItems="center"
        bgcolor="success.lighter"
        sx={{ borderRadius: 2, py: 0.5, px: 0.75 }}
      >
        <Typography variant="subtitle2" color={result.color}>
          {result.label}
        </Typography>
        {result.helper ? (
          <Typography variant="overline" fontWeight={500}>
            {result.helper}
          </Typography>
        ) : null}
      </Stack>
    ) : (
      <>
        <Typography variant="subtitle2" color={result.color}>
          {result.label}
        </Typography>
        {result.helper ? (
          <Typography variant="overline" fontWeight={500}>
            {result.helper}
          </Typography>
        ) : null}
      </>
    )}
  </Stack>
);

const resultComponents: Record<string, ComponentType<ContestantProblemResultProps>> = {
  [ContestType.ACM2H]: Acm2hProblemResult,
  [ContestType.ACM10M]: Acm10mProblemResult,
  [ContestType.ACM20M]: Acm20mProblemResult,
  [ContestType.IOI]: IoiProblemResult,
  [ContestType.Ball525]: Ball525ProblemResult,
  [ContestType.Ball550]: Ball550ProblemResult,
  [ContestType.LessCode]: LessCodeProblemResult,
  [ContestType.LessLine]: LessLineProblemResult,
  [ContestType.OneAttempt]: OneAttemptProblemResult,
  [ContestType.IQ]: IqProblemResult,
  [ContestType.Ball]: GenericBallProblemResult,
  [ContestType.DC]: DcProblemResult,
  [ContestType.MultiL]: MultiLanguageProblemResult,
  [ContestType.CodeGolf]: CodeGolfProblemResult,
  [ContestType.Exam]: ExamProblemResult,
};

const ContestantProblemResultCell = (props: ContestantProblemResultProps) => {
  const Renderer = props.contestType ? resultComponents[props.contestType] : undefined;
  const FallbackRenderer = contestHasBalls(props.contestType, props.typeInfo)
    ? BallProblemResult
    : AcmProblemResult;

  const Component = Renderer ?? FallbackRenderer;
  return <Component {...props} />;
};

export default ContestantProblemResultCell;
