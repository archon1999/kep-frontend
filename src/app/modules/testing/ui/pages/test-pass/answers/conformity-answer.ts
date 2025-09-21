import { AnswerResult } from './answer-result';

export const buildConformityAnswer = (
  groupOne: string[] = [],
  groupTwo: string[] = [],
): AnswerResult<{ group_one: string[]; group_two: string[] }> => {
  const answer = {
    group_one: groupOne,
    group_two: groupTwo,
  };

  return {
    answer,
    isEmpty: !groupOne.length || !groupTwo.length,
  };
};
