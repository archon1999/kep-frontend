import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Question } from '../entities/question.entity.ts';
import { QuestionType } from '../enums/question-type.enum.ts';
import { hydrateQuestion } from './hydrate-question.ts';

test('ordering question labels use the existing fallback priority without modifying the source', () => {
  const question: Question = {
    id: 1,
    number: 1,
    text: 'Order the values',
    type: QuestionType.Ordering,
    options: [
      { option: 'Primary', optionSecondary: 'Secondary' },
      { optionSecondary: 'Secondary', optionMain: 'Main' },
      { optionMain: 'Main' },
      {},
    ],
  };
  const hydrated = hydrateQuestion(question);
  assert.deepEqual(
    hydrated.options?.map(({ option }) => option),
    ['Primary', 'Secondary', 'Main', '#4'],
  );
  assert.notEqual(hydrated, question);
  assert.equal(question.options?.[1].option, undefined);
});
