import { Chapter } from "@testing/domain";

export interface ChallengeCall {
  id: number;
  username: string;
  rankTitle: string;
  timeSeconds: number;
  questionsCount: number;
  chapters: Array<Chapter>;
  created: string;
}
