export interface NewChallengeCall {
  timeSeconds: number;
  questionsCount: number;
  selectedChapters?: Array<number>;
}
