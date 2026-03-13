import { ChallengeQuestionTimeType } from '../enums/challenge-question-time-type.enum.ts';
import { ChallengeStatus } from '../enums/challenge-status.enum.ts';
import { ChallengePlayer } from './challenge-player.entity.ts';
import { ChallengeQuestion } from './challenge-question.entity.ts';

export interface Challenge {
  id: number;
  playerFirst: ChallengePlayer;
  playerSecond: ChallengePlayer;
  finished: string | null;
  questionsCount: number;
  timeSeconds: number;
  rated: boolean;
  questionTimeType: ChallengeQuestionTimeType;
  nextQuestion?: ChallengeQuestion;
  status: ChallengeStatus;
}
