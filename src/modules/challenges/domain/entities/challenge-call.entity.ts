import { Chapter } from 'modules/testing/domain/entities/chapter.entity.ts';
import { ChallengeQuestionTimeType } from '../enums/challenge-question-time-type.enum.ts';

export interface ChallengeCall {
  id: number;
  username: string;
  rankTitle: string;
  timeSeconds: number;
  questionsCount: number;
  questionTimeType: ChallengeQuestionTimeType;
  chapters: Chapter[];
  created: string;
}
