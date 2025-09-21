import { AnswerResult } from './answer-result';

export const buildTextInputAnswer = (input: string | undefined | null): AnswerResult<string | undefined | null> => {
  const answer = input ?? '';

  return {
    answer,
    isEmpty: !answer,
  };
};
