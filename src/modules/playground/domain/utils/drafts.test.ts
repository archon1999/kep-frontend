import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeDrafts } from './drafts.ts';

test('preserves complete legacy KEPLang edits and Unicode input', () => {
  const draft = { code: 'chiqar("Xorazm");\n' + '//🙂\n'.repeat(8000), input: 'ava\nrast\n' };
  assert.deepEqual(decodeDrafts(null, JSON.stringify(draft)).kep, draft);
});

test('keeps independent language drafts, including an intentionally empty program', () => {
  const saved = { kep: { code: 'chiqar(8);', input: '' }, py: { code: '', input: '3 5\n' } };
  assert.deepEqual(decodeDrafts(JSON.stringify(saved), '{"code":"old","input":""}'), saved);
  assert.deepEqual(decodeDrafts('{bad-json', 'null'), {});
});

test('ignores corrupted draft entries without losing valid programs', () => {
  const draft = { code: 'print(8)', input: '3 5\n' };
  assert.deepEqual(
    decodeDrafts(JSON.stringify({ py: draft, java: { code: 10, input: '' } }), null),
    { py: draft },
  );
});
