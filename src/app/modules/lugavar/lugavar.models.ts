export interface Trick {
  text: string;
  codeTemplate: string;
  likes: number;
}

export interface QuestionOption {
  id: number;
  option: string;
  isAnswer: boolean;
  selected: number;
}

export interface Question {
  body: string;
  options: Array<QuestionOption>;
  isAnswered: boolean;
  totalAnswered: number;
  likes: number;
}

export interface InterestingFact {
  body: string;
  likes: number;
}

export interface DictionaryWord {
  id: number;
  word: string;
  meaning: string;
  likes: number;
}
