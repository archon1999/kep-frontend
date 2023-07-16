import { ContestProblem } from "../../contests/contests.models";
import { User } from "../../users/users.models";

export function getEditorLang(lang: string) {
  if (lang == AttemptLangs.CPP) {
    return 'cpp';
  } else if (lang == AttemptLangs.PYTHON) {
    return 'python';
  } else if (lang == AttemptLangs.HASKELL) {
    return 'haskell';
  } else if (lang == AttemptLangs.KOTLIN) {
    return 'kotlin';
  } else if (lang == AttemptLangs.CSHARP) {
    return 'csharp';
  }
  return lang;
}

export enum AttemptLangs {
  PYTHON = 'py',
  CPP = 'cpp',
  R = 'r',
  HASKELL = 'hs',
  KEP = 'kep',
  C = 'c',
  KOTLIN = 'kt',
  TEXT = 'text',
  HTML = 'html',
  SQL = 'sql',
  BASH = 'bash',
  JS = 'js',
  PHP = 'php',
  CSHARP = 'cs',
  JAVA = 'java',
}

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
    public animationWrongState = false,
    public animationAcceptedState = false,
  ) { }

  getEditorLang() {
    return getEditorLang(this.lang);
  }

  getContestTime(startTime: Date | string) {
    startTime = new Date(startTime);
    let seconds = Math.trunc((this.created.valueOf() - startTime.valueOf()) / 1000);
    let minutes = Math.trunc(seconds / 60);
    let hours = Math.trunc(minutes / 60);
    minutes %= 60;
    seconds %= 60;
    let time = (hours + '').padStart(2, '0');
    time += ':' + (minutes + '').padStart(2, '0');
    time += ':' + (seconds + '').padStart(2, '0');
    return time;
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
    );
  }
}

export class WSAttempt {
  constructor(
    public id: number,
    public verdict: number,
    public verdictTitle: string,
    public testCaseNumber: number,
    public time: number,
    public memory: number,
    public balls: number,
  ) { }
}

export enum Verdicts {
  InQueue = -2,
  Running,
  JudgementFailed,
  Accepted,
  WrongAnswer,
  TimeLimitExceeded,
  RuntimeError,
  OutputFormatError,
  MemoryLimitExceeded,
  Rejected,
  CompilationError,
  CommandExecutingError,
  IdlenessLimitExceeded,
  SyntaxError,
  CheckerNotFound,
  OnlyPython,
  ObjectNotFound,
  FakeAccepted,
  PartialSolution,
}
