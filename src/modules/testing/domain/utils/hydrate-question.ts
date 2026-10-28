import type { Question } from '../entities/question.entity.ts';
import { QuestionType } from '../enums/question-type.enum.ts';

export const hydrateQuestion = (question: Question): Question => {
  if (question.type === QuestionType.Ordering && question.options?.length) {
    return {
      ...question,
      options: question.options.map((option, index) => ({
        ...option,
        option: option.option || option.optionSecondary || option.optionMain || `#${index + 1}`,
      })),
    };
  }

  return question;
};
