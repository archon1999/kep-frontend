import { Chapter } from 'modules/testing/domain/entities/chapter.entity.ts';

export interface ChallengeCall {
  id: number;
  username: string;
  rankTitle: string;
  timeSeconds: number;
  questionsCount: number;
  chapters: Chapter[];
  created: string;
}
