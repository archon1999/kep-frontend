import assert from 'node:assert/strict';
import test from 'node:test';
import { inlineRowErrors } from './inlineValidation.ts';

test('formset errors follow stable row ids after server reordering and removal of unsaved rows', () => {
  const changes = {
    new: { id: null, clientId: 'new', values: {} },
    old: { id: '42', values: {} },
    removed: { id: null, clientId: 'removed', values: {}, delete: true },
  };
  const errors = { rows: [{ title: ['Required'] }, { question: ['Choose a question'] }] };
  assert.deepEqual(inlineRowErrors(changes, errors), {
    '42': { title: ['Required'] },
    new: { question: ['Choose a question'] },
  });
});

test('non-row errors and valid formset rows do not mark unrelated fields invalid', () => {
  const changes = { old: { id: '42', values: {} } };
  assert.deepEqual(inlineRowErrors(changes, { rows: [{}], errors: ['Duplicate rows'] }), {});
  assert.deepEqual(inlineRowErrors(changes, ['Invalid section']), {});
  assert.deepEqual(inlineRowErrors(changes, null), {});
});
