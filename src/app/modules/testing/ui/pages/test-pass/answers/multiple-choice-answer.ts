import { AnswerResult } from './answer-result';

interface MultipleChoiceOption {
  selected?: boolean;
}

export const buildMultipleChoiceAnswer = (
  options: MultipleChoiceOption[] = [],
): AnswerResult<number[]> => {
  const answer = options.reduce<number[]>((acc, option, index) => {
    if (option.selected) {
      acc.push(index);
    }

    return acc;
  }, []);

  return {
    answer,
    isEmpty: answer.length === 0,
  };
};
