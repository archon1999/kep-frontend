import { QuestionType } from '../enums/question-type.enum';

export interface Question {
  id: number;
  number: number;
  type: QuestionType;
  text: string;
  options: any[];
  input?: string;
  answered?: boolean;
} 