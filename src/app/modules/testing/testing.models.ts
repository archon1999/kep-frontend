import { Tag } from '@problems/models/problems.models';

export interface Chapter {
  id: number;
  title: string;
  icon: string;
  testsCount?: number;
  tests?: Array<Test>;
}

export interface Test {
  id: number;
  title: string;
  chapter: Chapter;
  duration: string;
  difficulty: number;
  difficultyTitle: string;
  description: string;
  questionsCount: string;
  userBestResult?: number;
  lastPassed?: string;
  passesCount?: number;
  tags?: Array<Tag>;
}
