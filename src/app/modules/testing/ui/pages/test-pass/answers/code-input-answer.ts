import { AnswerResult } from './answer-result';

export const buildCodeInputAnswer = (input: string | undefined | null): AnswerResult<string | undefined | null> => {
  const answer = input ?? '';

  return {
    answer,
    isEmpty: !answer,
  };
};
