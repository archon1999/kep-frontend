import { AnswerResult } from './answer-result';

export interface ClassificationGroup {
  key: string;
  values: string[];
}

export const buildClassificationAnswer = (
  groups: ClassificationGroup[] = [],
): AnswerResult<{ classification_groups: ClassificationGroup[] }> => {
  const answer = { classification_groups: groups };

  return {
    answer,
    isEmpty: groups.length === 0,
  };
};
