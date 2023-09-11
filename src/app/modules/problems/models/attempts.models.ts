import { ContestProblem } from '../../contests/contests.models';
import { User } from '../../users/users.models';
import { getEditorLang } from '../utils';


export class Attempt {
  constructor(
    public id: number,
    public user: User,
    public team: any,
    public problemId: number,
    public problemTitle: string,
    public verdict: number,
    public verdictTitle: string,
    public lang: string,
    public langFull: string,
    public canView: boolean,
    public canTestView: boolean,
    public kepcoinValue: number,
    public testCaseNumber: number,
    public time: number,
    public memory: number,
    public created: Date,
    public sourceCode: string,
    public sourceCodeSize: number,
    public contestProblem: ContestProblem,
    public balls: number,
    public contestTime: string,
    public animationWrongState = false,
    public animationAcceptedState = false,
  ) { }

  getEditorLang() {
    return getEditorLang(this.lang);
  }

  static fromJSON(data: any) {
    return new Attempt(
      data.id,
      data.user,
      data.team,
      data.problemId,
      data.problemTitle,
      data.verdict,
      data.verdictTitle,
      data.lang,
      data.langFull,
      data.canView,
      data.canTestView,
      data.kepcoinValue,
      data.testCaseNumber,
      data.time,
      data.memory,
      new Date(data.created),
      data.sourceCode,
      data.sourceCodeSize,
      data.contestProblem,
      data.balls,
      data.contestTime,
    );
  }

  static fromWSAttempt(attempt, wsAttempt) {
    return new Attempt(
      attempt.id,
      attempt.user,
      attempt.team,
      attempt.problemId,
      attempt.problemTitle,
      wsAttempt.verdict,
      wsAttempt.verdictTitle,
      attempt.lang,
      attempt.langFull,
      attempt.canView,
      attempt.canTestView,
      attempt.kepcoinValue,
      wsAttempt.testCaseNumber,
      wsAttempt.time,
      wsAttempt.memory,
      attempt.created,
      attempt.sourceCode,
      attempt.sourceCodeSize,
      attempt.contestProblem,
      wsAttempt.balls,
      attempt.contestTime,
    );
  }
}

export interface WSAttempt {
  id: number;
  verdict: number;
  verdictTitle: string;
  testCaseNumber: number;
  time: number;
  memory: number;
  balls: number;
}
