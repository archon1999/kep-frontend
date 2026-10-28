import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { Question, QuestionType } from 'modules/testing/domain';
import { QuestionState, TestPassQuestion } from 'modules/testing/domain/entities/test-pass.types';
import { buildAnswerResult } from 'modules/testing/domain/utils/test-pass-answer';
import { buildInitialState } from 'modules/testing/domain/utils/test-pass-state';
import ClassificationQuestion from 'modules/testing/ui/pages/TestPassPage/components/ClassificationQuestion.tsx';
import CodeInputQuestion from 'modules/testing/ui/pages/TestPassPage/components/CodeInputQuestion.tsx';
import ConformityQuestion from 'modules/testing/ui/pages/TestPassPage/components/ConformityQuestion.tsx';
import MultipleChoiceQuestion from 'modules/testing/ui/pages/TestPassPage/components/MultipleChoiceQuestion.tsx';
import OrderingQuestion from 'modules/testing/ui/pages/TestPassPage/components/OrderingQuestion.tsx';
import SingleChoiceQuestion from 'modules/testing/ui/pages/TestPassPage/components/SingleChoiceQuestion.tsx';
import TextInputQuestion from 'modules/testing/ui/pages/TestPassPage/components/TextInputQuestion.tsx';
import ChapterLogo from 'shared/components/common/ChapterLogo';
import ChallengeChessPuzzleQuestion, {
  ChessPuzzleQuestionHandle,
} from './ChallengeChessPuzzleQuestion.tsx';

interface QuestionCardProps {
  challengeId?: number;
  questionNumber?: number;
  question?: Question;
  toolbar?: ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (payload: {
    answer: unknown;
    isFinish?: boolean;
    forceFail?: boolean;
  }) => Promise<void> | void;
}

export interface QuestionCardHandle {
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
      const ids =
        (answer as number[])?.map((index) => question.options?.[index]?.id ?? index) ?? [];
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

const ChallengeQuestionCard = forwardRef<QuestionCardHandle, QuestionCardProps>(
  ({ challengeId, questionNumber, question, toolbar, onSubmit, disabled, isSubmitting }, ref) => {
    const { t } = useTranslation();
    const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
    const chessQuestionRef = useRef<ChessPuzzleQuestionHandle>(null);
    const questionStateKey = question
      ? `${questionNumber ?? question.number}:${question.id}`
      : null;

    useEffect(() => {
      if (!question || !questionStateKey || question.type === QuestionType.ChessPuzzle) return;
      setQuestionStates((prev) =>
        prev[questionStateKey]
          ? prev
          : {
              ...prev,
              [questionStateKey]: buildInitialState(question as TestPassQuestion),
            },
      );
    }, [question, questionStateKey]);

    const currentQuestionState = useMemo(
      () => (questionStateKey ? questionStates[questionStateKey] : undefined),
      [questionStateKey, questionStates],
    );

    const updateState = (updater: (prev: QuestionState) => QuestionState) => {
      if (!question || !questionStateKey) return;
      setQuestionStates((prev) => ({
        ...prev,
        [questionStateKey]: updater(
          prev[questionStateKey] ?? buildInitialState(question as TestPassQuestion),
        ),
      }));
    };

    const handleSubmit = (options?: { isFinish?: boolean; force?: boolean }) => {
      if (!question) return;
      if (question.type === QuestionType.ChessPuzzle) {
        if (options?.force) {
          chessQuestionRef.current?.forceFail();
        }
        return;
      }

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
                  return {
                    type: QuestionType.MultipleChoice,
                    selectedOptions: Array.from(next).sort((a, b) => a - b),
                  };
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
        case QuestionType.ChessPuzzle:
          return (
            <ChallengeChessPuzzleQuestion
              ref={chessQuestionRef}
              challengeId={challengeId}
              questionNumber={questionNumber}
              question={question}
              disabled={disabled}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
            />
          );
        default:
          return null;
      }
    };

    useImperativeHandle(ref, () => ({
      submit: (options) => handleSubmit(options),
    }));

    if (!question) return null;

    return (
      <Card variant="section">
        {toolbar && (
          <Box
            sx={{
              px: 'var(--kep-content-inset)',
              py: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            {toolbar}
          </Box>
        )}
        <CardContent sx={{ p: 'var(--kep-content-inset)' }}>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
              {!toolbar && (
                <Typography variant="metric" sx={{ fontSize: 24 }}>
                  #{questionNumber ?? question.number}
                </Typography>
              )}
              {question.chapter ? <ChapterLogo chapter={question.chapter} size={28} /> : null}
            </Stack>

            {question.audio ? (
              <audio
                key={`${question.id}:${questionNumber ?? question.number}:${question.audio}`}
                controls
                src={question.audio}
                style={{ width: '100%' }}
              />
            ) : null}

            <Divider />

            <Box
              component="fieldset"
              disabled={disabled || isSubmitting}
              sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}
            >
              {renderQuestion()}
            </Box>

            {question.type !== QuestionType.ChessPuzzle ? (
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => handleSubmit()}
                  disabled={
                    disabled ||
                    isSubmitting ||
                    buildChallengeAnswer(question, currentQuestionState).isEmpty
                  }
                  loading={isSubmitting}
                  sx={{ minWidth: 160, width: { xs: '100%', sm: 'auto' } }}
                >
                  {isSubmitting ? t('common.loading') : t('challenges.submitAnswer')}
                </Button>
              </Box>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    );
  },
);

export default ChallengeQuestionCard;
