import { ChallengePlayer, ChallengeQuestion } from '@challenges/interfaces';
import { ChallengeQuestionTimeType } from '@challenges/constants';

export class Challenge {
  constructor(
    public id: number,
    public playerFirst: ChallengePlayer,
    public playerSecond: ChallengePlayer,
    public finished: string | null,
    public questionsCount: number,
    public timeSeconds: number,
    public rated: boolean,
    public questionTimeType: ChallengeQuestionTimeType,
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
