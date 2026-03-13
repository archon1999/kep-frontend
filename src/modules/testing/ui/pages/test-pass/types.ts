import { Question, QuestionType } from '../../../domain';

export type TestPassQuestion = Question & {
  body?: string;
  audio?: string;
};

export type ClassificationGroup = {
  key: string;
  values: string[];
};

export type QuestionState =
  | { type: QuestionType.SingleChoice; selectedOption: number }
  | { type: QuestionType.MultipleChoice; selectedOptions: number[] }
  | { type: QuestionType.TextInput | QuestionType.CodeInput; value: string }
  | { type: QuestionType.Conformity; groupOne: string[]; groupTwo: string[] }
  | { type: QuestionType.Ordering; ordering: string[] }
  | { type: QuestionType.Classification; groups: ClassificationGroup[] };
