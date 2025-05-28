import { Chapter } from '@testing/domain';
import { Question } from '@testing/domain';

export interface Test {
  id: number;
  title: string;
  description: string;
  duration: string;
  chapter: Chapter;
  questions: Question[];
  difficultyTitle: string;
  difficulty: number;
  tags: Array<{
    id: number;
    name: string;
  }>,
  userBestResult?: number;
  questionsCount?: number;
  passesCount?: number;
  lastPassed?: string;
}
