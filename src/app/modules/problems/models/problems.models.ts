import { AttemptLangs } from "../enums";

export interface Problem {
  id: number;
  authorUsername: string;
  title: string
  difficulty: number;
  difficultyTitle: string;
  likesCount: number;
  dislikesCount: number;
  voteType: number;
  solved: number;
  notSolved: number;
  attemptsCount: number;
  hasSolved: boolean;
  canViewSolution: boolean;
  hasAttempted: boolean;
  hasChecker: boolean;
  hasSolution: boolean;
  tags: Array<Tag>;
  timeLimit: number;
  memoryLimit: number;
  body: string;
  inputData: string;
  outputData: string;
  comment: string;
  sampleTests: Array<SampleTest>;
  codeTemplate: string;
  availableLanguages: Array<AvailableLanguage>;
  image: string;
  hidden: boolean;
}

export interface AvailableLanguage {
  lang: AttemptLangs;
  timeLimit: number | null;
  memoryLimit: number | null;
  codeTemplate: string;
}

export interface SampleTest {
  input: string;
  output: string
}

export interface Difficulty {
  value: number;
  name: string;
}

export interface Tag {
  name: string;
  id: number;
}

export interface ProblemsFilter {
  title: string;
  tags: Array<number>;
  difficulty: number;
  status: number;
  topic: number;
  ordering: string;
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
