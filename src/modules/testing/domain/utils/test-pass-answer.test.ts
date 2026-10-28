import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestPassQuestion } from '../entities/test-pass.types.ts';
import { QuestionType } from '../enums/question-type.enum.ts';
import { buildAnswerResult } from './test-pass-answer.ts';
import { buildInitialState } from './test-pass-state.ts';

const question = (
  type: QuestionType,
  fields: Partial<TestPassQuestion> = {},
): TestPassQuestion => ({
  id: 1,
  number: 1,
  text: 'Question',
  type,
  ...fields,
});

test('restored choice index zero and code whitespace are valid answers', () => {
  const choice = question(QuestionType.SingleChoice, { options: [{ selected: true }] });
  assert.deepEqual(buildAnswerResult(choice, buildInitialState(choice)), {
    answer: 0,
    isEmpty: false,
  });
  const code = question(QuestionType.CodeInput, { input: '  print(0)\n' });
  assert.deepEqual(buildAnswerResult(code, buildInitialState(code)), {
    answer: '  print(0)\n',
    isEmpty: false,
  });
  assert.equal(buildAnswerResult(question(QuestionType.SingleChoice)).isEmpty, true);
});

test('initializing randomized question formats preserves every option and the source question', () => {
  const source = question(QuestionType.Ordering, {
    options: [{ option: 'first' }, { optionSecondary: 'second' }, { optionMain: 'third' }, {}],
  });
  const original = structuredClone(source);
  const state = buildInitialState(source);
  assert.equal(state.type, QuestionType.Ordering);
  if (state.type !== QuestionType.Ordering) throw Error('Unexpected question state');
  assert.deepEqual([...state.ordering].sort(), ['#4', 'first', 'second', 'third']);
  assert.deepEqual(source, original);
});

test('submitted matching, ordering and classification answers retain their existing wire contract', () => {
  assert.deepEqual(
    buildAnswerResult(question(QuestionType.Conformity), {
      type: QuestionType.Conformity,
      groupOne: ['a', 'b'],
      groupTwo: ['2', '1'],
    }),
    { answer: { group_one: ['a', 'b'], group_two: ['2', '1'] }, isEmpty: false },
  );
  assert.deepEqual(
    buildAnswerResult(question(QuestionType.Ordering), {
      type: QuestionType.Ordering,
      ordering: ['b', 'a'],
    }),
    { answer: { ordering_list: ['b', 'a'] }, isEmpty: false },
  );
  const groups = [
    { key: 'A', values: ['one', 'two'] },
    { key: 'B', values: [] },
  ];
  assert.deepEqual(
    buildAnswerResult(question(QuestionType.Classification), {
      type: QuestionType.Classification,
      groups,
    }),
    { answer: { classification_groups: groups }, isEmpty: false },
  );
});
