import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import Acm2hProblemResult from './Acm2hProblemResult';
import Acm10mProblemResult from './Acm10mProblemResult';
import Acm20mProblemResult from './Acm20mProblemResult';
import BallProblemResult from './BallProblemResult';
import Ball525ProblemResult from './Ball525ProblemResult';
import Ball550ProblemResult from './Ball550ProblemResult';
import CodeGolfProblemResult from './CodeGolfProblemResult';
import DcProblemResult from './DcProblemResult';
import ExamProblemResult from './ExamProblemResult';
import IoiProblemResult from './IoiProblemResult';
import IqProblemResult from './IqProblemResult';
import LessCodeProblemResult from './LessCodeProblemResult';
import LessLineProblemResult from './LessLineProblemResult';
import MultiLanguageProblemResult from './MultiLanguageProblemResult';
import OneAttemptProblemResult from './OneAttemptProblemResult';
import type { ProblemResultComponent } from './types';

const resultComponents: Record<string, ProblemResultComponent> = {
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
  [ContestType.Ball]: BallProblemResult,
  [ContestType.DC]: DcProblemResult,
  [ContestType.MultiL]: MultiLanguageProblemResult,
  [ContestType.CodeGolf]: CodeGolfProblemResult,
  [ContestType.Exam]: ExamProblemResult,
};

export default resultComponents;
