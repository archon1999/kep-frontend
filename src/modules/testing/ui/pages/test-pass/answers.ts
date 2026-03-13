import { QuestionType } from '../../../domain';
import { QuestionState, TestPassQuestion } from './types';

export interface AnswerResult<T = unknown> {
  answer: T;
  isEmpty: boolean;
}

export const buildAnswerResult = (
  question: TestPassQuestion,
  state?: QuestionState,
): AnswerResult => {
  switch (question.type) {
    case QuestionType.SingleChoice: {
      const answer = state && state.type === QuestionType.SingleChoice ? state.selectedOption : -1;
      return { answer, isEmpty: answer === -1 };
    }
    case QuestionType.MultipleChoice: {
      const answer =
        state && state.type === QuestionType.MultipleChoice ? state.selectedOptions : [];
      return { answer, isEmpty: answer.length === 0 };
    }
    case QuestionType.TextInput:
    case QuestionType.CodeInput: {
      const answer = state && (state.type === QuestionType.TextInput || state.type === QuestionType.CodeInput)
        ? state.value
        : '';
      return { answer, isEmpty: !answer };
    }
    case QuestionType.Conformity: {
      const groupOne =
        state && state.type === QuestionType.Conformity ? state.groupOne : [];
      const groupTwo =
        state && state.type === QuestionType.Conformity ? state.groupTwo : [];
      return { answer: { group_one: groupOne, group_two: groupTwo }, isEmpty: !groupOne.length || !groupTwo.length };
    }
    case QuestionType.Ordering: {
      const ordering =
        state && state.type === QuestionType.Ordering ? state.ordering : [];
      return { answer: { ordering_list: ordering }, isEmpty: ordering.length === 0 };
    }
    case QuestionType.Classification: {
      const groups =
        state && state.type === QuestionType.Classification ? state.groups : [];
      return { answer: { classification_groups: groups }, isEmpty: groups.length === 0 };
    }
    default:
      return { answer: null, isEmpty: true };
  }
};
