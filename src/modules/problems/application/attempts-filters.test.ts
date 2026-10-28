import assert from 'node:assert/strict';
import test from 'node:test';
import { type AttemptsFilterState, buildAttemptsListParams } from './attempts-filters.ts';

const filters: AttemptsFilterState = {
  username: '',
  problemId: '',
  verdict: '',
  lang: '',
  testCaseNumber: '',
  testCaseNumberOperator: 'exact',
};

test('attempts distinguish zero verdicts from empty or malformed numeric filters', () => {
  const empty = buildAttemptsListParams(filters, { page: 1, pageSize: 20 });
  assert.equal(empty.problemId, undefined);
  assert.equal(empty.verdict, undefined);
  assert.equal(empty.testCaseNumberOperator, undefined);
  const request = buildAttemptsListParams(
    {
      ...filters,
      problemId: '123',
      verdict: '0',
      testCaseNumber: '4',
      testCaseNumberOperator: 'gt',
    },
    { page: 3, pageSize: 50 },
  );
  assert.equal(request.problemId, 123);
  assert.equal(request.verdict, 0);
  assert.equal(request.testCaseNumber, 4);
  assert.equal(request.testCaseNumberOperator, 'gt');
  assert.equal(request.page, 3);
  assert.equal(request.pageSize, 50);
  const malformed = buildAttemptsListParams(
    { ...filters, problemId: 'NaN', verdict: 'invalid', testCaseNumber: ' ' },
    { page: 1, pageSize: 20 },
  );
  assert.equal(malformed.problemId, undefined);
  assert.equal(malformed.verdict, undefined);
  assert.equal(malformed.testCaseNumberOperator, undefined);
});
