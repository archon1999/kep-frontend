import { AnswerResult } from './answer-result';

export const buildOrderingAnswer = (
  orderingList: string[] = [],
): AnswerResult<{ ordering_list: string[] }> => {
  const answer = { ordering_list: orderingList };

  return {
    answer,
    isEmpty: orderingList.length === 0,
  };
};
