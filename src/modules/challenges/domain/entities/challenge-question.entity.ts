import { Question } from 'modules/testing/domain/entities/question.entity.ts';

export interface ChallengeQuestion {
  number: number;
  question: Question;
}
