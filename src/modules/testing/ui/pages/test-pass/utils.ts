import { QuestionType } from '../../../domain';
import { ClassificationGroup, QuestionState, TestPassQuestion } from './types';

export const randomInt = (lower: number, upper: number) =>
  Math.floor(Math.random() * (upper - lower + 1)) + lower;

export const randomChoice = <T>(items: T[]): T => {
  if (!items.length) {
    return items[0];
  }

  const index = randomInt(0, items.length - 1);
  return items[index];
};

export const randomShuffle = <T>(items: T[]): T[] => {
  const shuffled = [...items];

  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = randomInt(0, currentIndex);
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
};

export const buildInitialState = (question: TestPassQuestion): QuestionState => {
  switch (question.type) {
    case QuestionType.SingleChoice:
      return {
        type: QuestionType.SingleChoice,
        selectedOption: question.options?.findIndex((option) => option.selected) ?? -1,
      };
    case QuestionType.MultipleChoice:
      return {
        type: QuestionType.MultipleChoice,
        selectedOptions:
          question.options?.reduce<number[]>((acc, option, index) => {
            if (option.selected) {
              acc.push(index);
            }
            return acc;
          }, []) ?? [],
      };
    case QuestionType.TextInput:
    case QuestionType.CodeInput:
      return {
        type: question.type,
        value: question.input ?? '',
      };
    case QuestionType.Conformity: {
      const options = question.options ?? [];
      const groupOne = randomShuffle(options.map((option) => option.optionMain ?? ''));
      const groupTwo = randomShuffle(options.map((option) => option.optionSecondary ?? ''));
      return { type: QuestionType.Conformity, groupOne, groupTwo };
    }
    case QuestionType.Ordering: {
      const ordering = randomShuffle(
        (question.options ?? []).map(
          (option, index) =>
            option.option ??
            option.optionSecondary ??
            option.optionMain ??
            `#${index + 1}`,
        ),
      );
      return { type: QuestionType.Ordering, ordering };
    }
    case QuestionType.Classification: {
      const optionKeys = Array.from(
        new Set((question.options ?? []).map((option) => option.optionMain ?? '').filter(Boolean)),
      );
      const groupsMap = new Map<string, string[]>();

      optionKeys.forEach((key) => groupsMap.set(key, []));

      (question.options ?? []).forEach((option, index) => {
        const fallbackKey = option.optionMain || `Group ${index + 1}`;
        const randomKey = randomChoice(optionKeys.length ? optionKeys : [fallbackKey]);
        const values = groupsMap.get(randomKey) ?? [];
        values.push(option.optionSecondary ?? '');
        groupsMap.set(randomKey, values);
      });

      const groups: ClassificationGroup[] = Array.from(groupsMap.entries()).map(([key, values]) => ({
        key,
        values,
      }));

      return { type: QuestionType.Classification, groups };
    }
    default:
      return { type: QuestionType.SingleChoice, selectedOption: -1 };
  }
};

export const formatRemainingTime = (milliseconds: number) => {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};
