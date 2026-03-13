export type DifficultyKey =
  | 'beginner'
  | 'basic'
  | 'normal'
  | 'medium'
  | 'advanced'
  | 'hard'
  | 'extremal';

export type DifficultyColor = 'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary';

export type DifficultyOption = { value: number; key: DifficultyKey; label: string };

export const difficultyOptions: DifficultyOption[] = [
  { value: 1, key: 'beginner', label: 'problems.difficulty.beginner' },
  { value: 2, key: 'basic', label: 'problems.difficulty.basic' },
  { value: 3, key: 'normal', label: 'problems.difficulty.normal' },
  { value: 4, key: 'medium', label: 'problems.difficulty.medium' },
  { value: 5, key: 'advanced', label: 'problems.difficulty.advanced' },
  { value: 6, key: 'hard', label: 'problems.difficulty.hard' },
  { value: 7, key: 'extremal', label: 'problems.difficulty.extremal' },
];

export const difficultyColorByValue: Record<number, DifficultyColor> = {
  1: 'success',
  2: 'info',
  3: 'info',
  4: 'primary',
  5: 'warning',
  6: 'error',
  7: 'secondary',
};

export const difficultyColorByKey = difficultyOptions.reduce<Record<DifficultyKey, DifficultyColor>>(
  (acc, option) => ({ ...acc, [option.key]: difficultyColorByValue[option.value] }),
  {
    beginner: 'success',
    basic: 'info',
    normal: 'info',
    medium: 'primary',
    advanced: 'warning',
    hard: 'error',
    extremal: 'secondary',
  },
);

export const getDifficultyLabelKey = (difficulty?: number) =>
  difficultyOptions.find((item) => item.value === difficulty)?.label;

export const getDifficultyColor = (difficulty?: number): DifficultyColor =>
  difficultyColorByValue[difficulty ?? 0] ?? 'primary';
