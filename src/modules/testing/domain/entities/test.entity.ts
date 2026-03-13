import { Chapter } from './chapter.entity.ts';
import { Question } from './question.entity.ts';

export interface TestTag {
  id: number;
  name: string;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  duration: string;
  chapter: Chapter;
  questions: Question[];
  difficultyTitle: string;
  difficulty: number;
  tags: TestTag[];
  userBestResult?: number;
  questionsCount?: number;
  passesCount?: number;
  lastPassed?: string;
  canStart?: boolean;
}
