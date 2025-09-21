import { AnswerResult } from './answer-result';

export const buildSingleChoiceAnswer = (
  selectedOption: number | null | undefined,
): AnswerResult<number> => {
  const answer = typeof selectedOption === 'number' ? selectedOption : -1;

  return {
    answer,
    isEmpty: answer === -1,
  };
};
