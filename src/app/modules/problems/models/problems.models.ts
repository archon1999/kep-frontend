import { AttemptLangs } from "../constants";

export interface ProblemUserInfo {
  hasAttempted: boolean;
  hasSolved: boolean;
  voteType?: number | null;
  canViewSolution?: boolean;
}

export interface Problem {
  id: number;
  authorUsername: string;
  userInfo: ProblemUserInfo;
  title: string
  difficulty: number;
  difficultyTitle: string;
  likesCount: number;
  dislikesCount: number;
  voteType: number;
  solved: number;
  notSolved: number;
  attemptsCount: number;
  hasChecker: boolean;
  canViewSolution: boolean;
  hasSolution: boolean;
  hasCheckInput: boolean;
  tags: Array<Tag>;
  topics: Array<Topic>;
  timeLimit: number;
  memoryLimit: number;
  body?: string;
  inputData?: string;
  outputData?: string;
  comment?: string;
  sampleTests?: Array<SampleTest>;
  availableLanguages?: Array<AvailableLanguage>;
  image?: string;
  hidden?: boolean;
  checkInputSource?: string;
}

export interface AvailableLanguage {
  lang: AttemptLangs;
  langFull: string;
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

export interface Topic {
  name: string;
  id: number;
}

export interface ProblemsFilter {
  page: number;
  pageSize: number;
  title: string;
  tags: Array<number>;
  difficulty: number;
  status: number;
  topic: number;
  ordering: string;
  hasChecker: boolean;
  hasCheckInput: boolean;
  hasSolution: boolean;
  partialSolvable: boolean;
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
