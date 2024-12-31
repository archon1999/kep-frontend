import { Chapter } from '@app/modules/testing/testing.models';

export interface ChallengeCall {
  id: number;
  username: string;
  rankTitle: string;
  timeSeconds: number;
  questionsCount: number;
  chapters: Array<Chapter>;
  created: string;
}
