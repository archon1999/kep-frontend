import { QuestionType } from '../enums/question-type.enum.ts';
import { Chapter } from './chapter.entity.ts';

export interface QuestionOption {
  id?: number;
  option?: string;
  optionMain?: string;
  optionSecondary?: string;
  selected?: boolean;
}

export interface ChessPuzzlePayload {
  puzzleId: string;
  fen: string;
  initialMove: string;
  orientation: 'white' | 'black';
  rating: number;
  themes: string[];
}

export interface Question {
  id: number;
  number: number;
  type: QuestionType;
  text: string;
  body?: string;
  audio?: string;
  options?: QuestionOption[];
  input?: string;
  answered?: boolean;
  chapter?: Chapter;
  payload?: ChessPuzzlePayload | Record<string, unknown>;
}
