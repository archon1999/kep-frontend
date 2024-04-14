import { Chapter } from '../../testing/testing.models';

export interface ChallengesRating {
  rowIndex: number;
  username: string;
  rating: number;
  rankTitle: string;
  wins: number;
  draws: number;
  losses: number;
  all: number;
}

export interface ChallengesRatingChange {
  date: Date | string;
  value: Number;
}

export interface ChallengeCall {
  id: number;
  username: string;
  rankTitle: string;
  timeSeconds: number;
  questionsCount: number;
  chapters: Array<Chapter>;
  created: string;
}

export interface NewChallengeCall {
  timeSeconds: number;
  questionsCount: number;
  selectedChapters?: Array<number>;
}

export interface ChallengePlayer {
  username: string;
  result: number;
  results: Array<number>;
  rating: number;
  newRating: number;
  rankTitle: string;
  newRankTitle: string;
  delta: number;
}

export interface ChallengeQuestion {
  number: number;
  question: any;
}

export class Challenge {
  constructor(
    public id: number,
    public playerFirst: ChallengePlayer,
    public playerSecond: ChallengePlayer,
    public finished: string | null,
    public questionsCount: number,
    public timeSeconds: number,
    public rated: boolean,
    public nextQuestion?: ChallengeQuestion,
    public status?: number,
  ) {}

  static fromJSON(challenge: Challenge) {
    if (challenge.nextQuestion.number > 0) {
      for (let i = challenge.nextQuestion.number - 1; i < challenge.questionsCount; i++){
        if (challenge.playerFirst.results[i] === 1) {
          challenge.playerFirst.result--;
        }
        if (challenge.playerSecond.results[i] === 1) {
          challenge.playerSecond.result--;
        }
        challenge.playerFirst.results[i] = -1;
        challenge.playerSecond.results[i] = -1;
      }
    }
    return challenge;
  }
}
