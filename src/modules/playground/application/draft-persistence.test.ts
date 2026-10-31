import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDraftPersistence } from './draft-persistence.ts';

test('navigation flushes the latest edit before the debounce expires', () => {
  const writes: string[] = [];
  const status: boolean[] = [];
  const store = createDraftPersistence(
    { setItem: (_, value) => writes.push(value) },
    'drafts',
    (saved) => status.push(saved),
  );
  store.schedule({ kep: { code: 'chiqar(1);', input: '' } });
  store.schedule({ kep: { code: 'chiqar(12);', input: '' } });
  store.dispose();
  assert.deepEqual(JSON.parse(writes[0]), { kep: { code: 'chiqar(12);', input: '' } });
  assert.equal(writes.length, 1);
  assert.deepEqual(status, []);
});

test('a failed write keeps the complete edit available for a later retry', () => {
  let unavailable = true;
  let saved = '';
  const statuses: boolean[] = [];
  const store = createDraftPersistence(
    {
      setItem: (_, value) => {
        if (unavailable) throw new Error('Quota exceeded');
        saved = value;
      },
    },
    'drafts',
    (value) => statuses.push(value),
  );
  const drafts = { py: { code: 'print("🙂")\n', input: '' } };
  store.schedule(drafts);
  store.flush();
  assert.deepEqual(statuses, [false]);
  unavailable = false;
  store.flush();
  store.dispose();
  assert.deepEqual(JSON.parse(saved), drafts);
  assert.deepEqual(statuses, [false, true]);
});
