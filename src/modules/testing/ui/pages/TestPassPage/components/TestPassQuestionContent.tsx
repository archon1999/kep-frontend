import { useTestPassPage } from 'modules/testing/application/hooks/useTestPassPage';
import { QuestionType } from 'modules/testing/domain';
import ClassificationQuestion from 'modules/testing/ui/pages/TestPassPage/components/ClassificationQuestion.tsx';
import CodeInputQuestion from 'modules/testing/ui/pages/TestPassPage/components/CodeInputQuestion.tsx';
import ConformityQuestion from 'modules/testing/ui/pages/TestPassPage/components/ConformityQuestion.tsx';
import MultipleChoiceQuestion from 'modules/testing/ui/pages/TestPassPage/components/MultipleChoiceQuestion.tsx';
import OrderingQuestion from 'modules/testing/ui/pages/TestPassPage/components/OrderingQuestion.tsx';
import SingleChoiceQuestion from 'modules/testing/ui/pages/TestPassPage/components/SingleChoiceQuestion.tsx';
import TextInputQuestion from 'modules/testing/ui/pages/TestPassPage/components/TextInputQuestion.tsx';

type Props = Pick<
  ReturnType<typeof useTestPassPage>,
  'currentQuestion' | 'ensureState' | 'updateState'
>;
export const TestPassQuestionContent = ({ currentQuestion, ensureState, updateState }: Props) => {
  if (!currentQuestion) {
    return null;
  }

  const state = ensureState(currentQuestion);

  switch (currentQuestion.type) {
    case QuestionType.SingleChoice: {
      const selected = state.type === QuestionType.SingleChoice ? state.selectedOption : -1;
      return (
        <SingleChoiceQuestion
          question={currentQuestion}
          selectedOption={selected}
          onChange={(value) =>
            updateState(currentQuestion, () => ({
              type: QuestionType.SingleChoice,
              selectedOption: value,
            }))
          }
        />
      );
    }
    case QuestionType.MultipleChoice: {
      const selectedOptions =
        state.type === QuestionType.MultipleChoice ? state.selectedOptions : [];
      return (
        <MultipleChoiceQuestion
          question={currentQuestion}
          selectedOptions={selectedOptions}
          onToggle={(index) =>
            updateState(currentQuestion, () => {
              const next = new Set(selectedOptions);
              if (next.has(index)) {
                next.delete(index);
              } else {
                next.add(index);
              }
              const ordered = Array.from(next).sort((a, b) => a - b);
              return { type: QuestionType.MultipleChoice, selectedOptions: ordered };
            })
          }
        />
      );
    }
    case QuestionType.TextInput: {
      const value = state.type === QuestionType.TextInput ? state.value : '';
      return (
        <TextInputQuestion
          question={currentQuestion}
          value={value}
          onChange={(input) =>
            updateState(currentQuestion, () => ({
              type: QuestionType.TextInput,
              value: input,
            }))
          }
        />
      );
    }
    case QuestionType.CodeInput: {
      const value = state.type === QuestionType.CodeInput ? state.value : '';
      return (
        <CodeInputQuestion
          question={currentQuestion}
          value={value}
          onChange={(input) =>
            updateState(currentQuestion, () => ({
              type: QuestionType.CodeInput,
              value: input,
            }))
          }
        />
      );
    }
    case QuestionType.Conformity: {
      const groupOne = state.type === QuestionType.Conformity ? state.groupOne : [];
      const groupTwo = state.type === QuestionType.Conformity ? state.groupTwo : [];
      return (
        <ConformityQuestion
          question={currentQuestion}
          groupOne={groupOne}
          groupTwo={groupTwo}
          onChange={(payload) =>
            updateState(currentQuestion, () => ({
              type: QuestionType.Conformity,
              groupOne: payload.groupOne ?? groupOne,
              groupTwo: payload.groupTwo ?? groupTwo,
            }))
          }
        />
      );
    }
    case QuestionType.Ordering: {
      const ordering = state.type === QuestionType.Ordering ? state.ordering : [];
      return (
        <OrderingQuestion
          question={currentQuestion}
          ordering={ordering}
          onChange={(items) =>
            updateState(currentQuestion, () => ({
              type: QuestionType.Ordering,
              ordering: items,
            }))
          }
        />
      );
    }
    case QuestionType.Classification: {
      const groups = state.type === QuestionType.Classification ? state.groups : [];
      return (
        <ClassificationQuestion
          question={currentQuestion}
          groups={groups}
          onChange={(nextGroups) =>
            updateState(currentQuestion, () => ({
              type: QuestionType.Classification,
              groups: nextGroups,
            }))
          }
        />
      );
    }
    default:
      return null;
  }
};
