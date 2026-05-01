import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Question, QuestionType } from 'modules/testing/domain';
import { buildInitialState } from 'modules/testing/ui/pages/test-pass/utils.ts';
import { buildAnswerResult } from 'modules/testing/ui/pages/test-pass/answers.ts';
import { QuestionState, TestPassQuestion } from 'modules/testing/ui/pages/test-pass/types.ts';
import SingleChoiceQuestion from 'modules/testing/ui/pages/test-pass/components/SingleChoiceQuestion.tsx';
import MultipleChoiceQuestion from 'modules/testing/ui/pages/test-pass/components/MultipleChoiceQuestion.tsx';
import TextInputQuestion from 'modules/testing/ui/pages/test-pass/components/TextInputQuestion.tsx';
import CodeInputQuestion from 'modules/testing/ui/pages/test-pass/components/CodeInputQuestion.tsx';
import ConformityQuestion from 'modules/testing/ui/pages/test-pass/components/ConformityQuestion.tsx';
import OrderingQuestion from 'modules/testing/ui/pages/test-pass/components/OrderingQuestion.tsx';
import ClassificationQuestion from 'modules/testing/ui/pages/test-pass/components/ClassificationQuestion.tsx';

interface ChallengeQuestionCardProps {
  question?: Question;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (payload: { answer: unknown; isFinish?: boolean }) => void;
}

export interface ChallengeQuestionCardHandle {
  submit: (options?: { isFinish?: boolean; force?: boolean }) => void;
}

const buildChallengeAnswer = (
  question: Question,
  state?: QuestionState,
): { answer: unknown; isEmpty: boolean } => {
  const { answer, isEmpty } = buildAnswerResult(question as TestPassQuestion, state);
  if (isEmpty) return { answer, isEmpty: true };

  switch (question.type) {
    case QuestionType.SingleChoice: {
      const selectedIndex = typeof answer === 'number' ? answer : -1;
      const optionId = question.options?.[selectedIndex]?.id ?? selectedIndex;
      return { answer: [optionId], isEmpty: optionId === -1 };
    }
    case QuestionType.MultipleChoice: {
      const ids = (answer as number[])?.map((index) => question.options?.[index]?.id ?? index) ?? [];
      return { answer: ids, isEmpty: ids.length === 0 };
    }
    case QuestionType.TextInput:
      return { answer: { input: answer }, isEmpty };
    case QuestionType.CodeInput:
      return { answer: { code: answer }, isEmpty };
    default:
      return { answer, isEmpty };
  }
};

const ChallengeQuestionCard = forwardRef<ChallengeQuestionCardHandle, ChallengeQuestionCardProps>(
  ({ question, onSubmit, disabled, isSubmitting }, ref) => {
  const { t } = useTranslation();
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});

  useEffect(() => {
    if (!question) return;
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: buildInitialState(question as TestPassQuestion),
    }));
  }, [question?.id, question]);

  const currentQuestionState = useMemo(
    () => (question ? questionStates[question.id] : undefined),
    [questionStates, question?.id],
  );

  const updateState = (updater: (prev: QuestionState) => QuestionState) => {
    if (!question) return;
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: updater(prev[question.id] ?? buildInitialState(question as TestPassQuestion)),
    }));
  };

  const handleSubmit = (options?: { isFinish?: boolean; force?: boolean }) => {
    if (!question) return;
    const { answer, isEmpty } = buildChallengeAnswer(question, currentQuestionState);

    if (isEmpty && !options?.force) return;

    onSubmit?.({ answer, isFinish: options?.isFinish });
  };

  const renderQuestion = () => {
    if (!question) return null;

    switch (question.type) {
      case QuestionType.SingleChoice: {
        const selected =
          currentQuestionState && currentQuestionState.type === QuestionType.SingleChoice
            ? currentQuestionState.selectedOption
            : -1;
        return (
          <SingleChoiceQuestion
            question={question as TestPassQuestion}
            selectedOption={selected}
            onChange={(value) =>
              updateState(() => ({
                type: QuestionType.SingleChoice,
                selectedOption: value,
              }))
            }
          />
        );
      }
      case QuestionType.MultipleChoice: {
        const selectedOptions =
          currentQuestionState && currentQuestionState.type === QuestionType.MultipleChoice
            ? currentQuestionState.selectedOptions
            : [];
        return (
          <MultipleChoiceQuestion
            question={question as TestPassQuestion}
            selectedOptions={selectedOptions}
            onToggle={(index) =>
              updateState(() => {
                const next = new Set(selectedOptions);
                if (next.has(index)) next.delete(index);
                else next.add(index);
                return { type: QuestionType.MultipleChoice, selectedOptions: Array.from(next).sort((a, b) => a - b) };
              })
            }
          />
        );
      }
      case QuestionType.TextInput: {
        const value =
          currentQuestionState && currentQuestionState.type === QuestionType.TextInput
            ? currentQuestionState.value
            : '';
        return (
          <TextInputQuestion
            question={question as TestPassQuestion}
            value={value}
            onChange={(input) =>
              updateState(() => ({
                type: QuestionType.TextInput,
                value: input,
              }))
            }
          />
        );
      }
      case QuestionType.CodeInput: {
        const value =
          currentQuestionState && currentQuestionState.type === QuestionType.CodeInput
            ? currentQuestionState.value
            : '';
        return (
          <CodeInputQuestion
            question={question as TestPassQuestion}
            value={value}
            onChange={(input) =>
              updateState(() => ({
                type: QuestionType.CodeInput,
                value: input,
              }))
            }
          />
        );
      }
      case QuestionType.Conformity: {
        const groupOne =
          currentQuestionState && currentQuestionState.type === QuestionType.Conformity
            ? currentQuestionState.groupOne
            : [];
        const groupTwo =
          currentQuestionState && currentQuestionState.type === QuestionType.Conformity
            ? currentQuestionState.groupTwo
            : [];
        return (
          <ConformityQuestion
            question={question as TestPassQuestion}
            groupOne={groupOne}
            groupTwo={groupTwo}
            onChange={(payload) =>
              updateState(() => ({
                type: QuestionType.Conformity,
                groupOne: payload.groupOne ?? groupOne,
                groupTwo: payload.groupTwo ?? groupTwo,
              }))
            }
          />
        );
      }
      case QuestionType.Ordering: {
        const ordering =
          currentQuestionState && currentQuestionState.type === QuestionType.Ordering
            ? currentQuestionState.ordering
            : [];
        return (
          <OrderingQuestion
            question={question as TestPassQuestion}
            ordering={ordering}
            onChange={(items) =>
              updateState(() => ({
                type: QuestionType.Ordering,
                ordering: items,
              }))
            }
          />
        );
      }
      case QuestionType.Classification: {
        const groups =
          currentQuestionState && currentQuestionState.type === QuestionType.Classification
            ? currentQuestionState.groups
            : [];
        return (
          <ClassificationQuestion
            question={question as TestPassQuestion}
            groups={groups}
            onChange={(nextGroups) =>
              updateState(() => ({
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

  useImperativeHandle(ref, () => ({
    submit: (options) => handleSubmit(options),
  }));

  if (!question) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
            <Typography variant="body1" fontWeight={500}>
              #{question.number}
            </Typography>
            {question.chapter ? (
              <Stack direction="row" spacing={1} alignItems="center">
                {question.chapter.icon ? <img src={question.chapter.icon} alt={question.chapter.title} width={32} /> : null}
                <Typography variant="body2" color="text.secondary">
                  {question.chapter.title}
                </Typography>
              </Stack>
            ) : null}
          </Stack>

          {question.audio ? (
            <audio controls style={{ width: '100%' }}>
              <source src={question.audio} />
            </audio>
          ) : null}

          <Divider />

          {renderQuestion()}

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => handleSubmit()}
              disabled={disabled || isSubmitting}
              sx={{ minWidth: 160 }}
            >
              {isSubmitting ? t('common.loading') : t('challenges.submitAnswer')}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default ChallengeQuestionCard;
