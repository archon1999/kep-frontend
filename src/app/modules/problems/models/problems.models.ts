export class Problem {
  constructor(
    public id: number,
    public authorUsername: string,
    public title: string,
    public difficulty: number,
    public difficultyTitle: string,
    public likesCount: number,
    public dislikesCount: number,
    public voteType: number,
    public solved: number,
    public notSolved: number,
    public attemptsCount: number,
    public hasSolved: boolean,
    public canViewSolution: boolean,
    public hasAttempted: boolean,
    public hasChecker: boolean,
    public hasSolution: boolean,
    public tags: Array<Tag>,
    public timeLimit: number,
    public memoryLimit: number,
    public body: string,
    public inputData: string,
    public outputData: string,
    public comment: string,
    public sampleTests: Array<SampleTest>,
    public codeTemplate: string,
    public availableLanguages: Array<AvailableLanguage>,
    public image: string,
  ) { }
}

export class AvailableLanguage {
  constructor(
    public lang: string,
    public timeLimit: number | null,
    public memoryLimit: number | null,
    public codeTemplate: string,
  ) { }
}

export class SampleTest {
  constructor(
    public input: string,
    public output: string
  ) { }
}

export class Difficulty {
  constructor(
    public value: number,
    public name: string,
  ) { }
}

export enum Difficulties {
  Beginner = 1,
  Basic = 2,
  Normal = 3,
  Medium = 4,
  Advanced = 5,
  Hard = 6,
  Extremal = 7,
}

export enum DifficultyLabels {
  Beginner = 'beginner',
  Basic = 'basic',
  Normal = 'normal',
  Medium = 'medium',
  Advanced = 'advanced',
  Hard = 'hard',
  Extremal = 'extremal',
}

export class Tag {
  constructor(
    public name: string,
    public id: number,
  ) { }
}

export interface ProblemFilter {
  title?: string;
  tags?: Array<number>;
  difficulty?: number;
  status?: number;
  topic?: number;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  description: string;
  problems: Array<Problem>;
}

export interface StudyPlan {
  id: number;
  title: string;
  description: string;
  descriptionShort: string;
  icon: string;
  daysCount: number;
  problemsCount: number;
  isPurchased: boolean;
  kepcoinValue: number;
  days: Array<StudyPlanDay>;
}
