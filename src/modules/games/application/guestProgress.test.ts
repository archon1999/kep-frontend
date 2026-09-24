import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gameIds } from '../domain/entities/games.types.ts';
import { worldShards, worldTerminals } from '../domain/world/world.ts';
import { flushPendingScore } from './pendingScoreSync.ts';
import {
  bestKey,
  claimGuestScores,
  clearGuestClaim,
  pendingKey,
  storedScore,
} from './scorePersistence.ts';
import {
  claimGuestWorldSave,
  emptyWorldSave,
  isWorldSavePristine,
  loadWorldSave,
  saveWorldSave,
} from './worldPersistence.ts';

const memoryStorage = () => {
  const entries = new Map<string, string>();
  const storage = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
  };
  return { storage, entries };
};

test('guest bests for all five games move once without lowering an account best', () => {
  const { storage, entries } = memoryStorage();
  for (const [index, id] of gameIds.entries()) {
    entries.set(bestKey(id, 'guest'), String((index + 1) * 100));
  }
  entries.set(bestKey('bug-hunt', 'alice'), '950');
  entries.set(pendingKey('logic-circuit', 'alice'), '800');

  assert.deepEqual(claimGuestScores(storage, 'alice'), [...gameIds]);
  for (const [index, id] of gameIds.entries()) {
    const guest = (index + 1) * 100;
    assert.equal(storedScore(storage, bestKey(id, 'alice')), id === 'bug-hunt' ? 950 : guest);
    assert.equal(
      storedScore(storage, pendingKey(id, 'alice')),
      id === 'bug-hunt' ? 950 : id === 'logic-circuit' ? 800 : guest,
    );
    assert.equal(entries.has(bestKey(id, 'guest')), false);
  }
  assert.equal(bestKey('keppy-world', 'alice'), 'kep-games:best:keppy-world:alice');
  assert.equal(bestKey('bug-hunt', 'alice'), 'kep-games:best:bug-hunt:alice');
  assert.deepEqual(claimGuestScores(storage, 'bob'), []);
  assert.equal(storedScore(storage, bestKey('bug-hunt', 'bob')), 0);
});

test('a later guest run can be claimed once by a different account', () => {
  const { storage, entries } = memoryStorage();
  entries.set(bestKey('memory-grid', 'guest'), '250');
  claimGuestScores(storage, 'alice');
  entries.set(bestKey('memory-grid', 'guest'), '310');
  clearGuestClaim(storage, 'memory-grid');
  assert.deepEqual(claimGuestScores(storage, 'bob'), ['memory-grid']);
  assert.equal(storedScore(storage, bestKey('memory-grid', 'bob')), 310);
  assert.deepEqual(claimGuestScores(storage, 'charlie'), []);
});

test('a failed account queue write leaves guest score available for retry', () => {
  const { storage, entries } = memoryStorage();
  entries.set(bestKey('bug-hunt', 'guest'), '720');
  const unreliable = {
    ...storage,
    setItem: (key: string, value: string) => {
      if (key === pendingKey('bug-hunt', 'alice')) throw Error('storage full');
      storage.setItem(key, value);
    },
  };
  assert.deepEqual(claimGuestScores(unreliable, 'alice'), []);
  assert.equal(storedScore(storage, bestKey('bug-hunt', 'guest')), 720);
  assert.deepEqual(claimGuestScores(storage, 'alice'), ['bug-hunt']);
});

test('an offline submission keeps the pending score and retry uses server maximum', async () => {
  const { storage, entries } = memoryStorage();
  entries.set(bestKey('bug-hunt', 'guest'), '700');
  claimGuestScores(storage, 'alice');
  await assert.rejects(
    flushPendingScore(
      'bug-hunt',
      'alice',
      async () => {
        throw Error('offline');
      },
      storage,
    ),
  );
  assert.equal(storedScore(storage, pendingKey('bug-hunt', 'alice')), 700);
  const submitted: number[] = [];
  const result = await flushPendingScore(
    'bug-hunt',
    'alice',
    async (id, score) => {
      submitted.push(score);
      return { gameId: id, score, bestScore: 900, improved: false };
    },
    storage,
  );
  assert.deepEqual(submitted, [700]);
  assert.deepEqual(result, { bestScore: 900, submitted: true });
  assert.equal(storedScore(storage, bestKey('bug-hunt', 'alice')), 900);
  assert.equal(entries.has(pendingKey('bug-hunt', 'alice')), false);
});

test('a higher score queued during an upload is submitted before the flight ends', async () => {
  const { storage, entries } = memoryStorage();
  entries.set(pendingKey('logic-circuit', 'alice'), '500');
  const submitted: number[] = [];
  const result = await flushPendingScore(
    'logic-circuit',
    'alice',
    async (id, score) => {
      submitted.push(score);
      if (score === 500) entries.set(pendingKey(id, 'alice'), '800');
      return { gameId: id, score, bestScore: score, improved: true };
    },
    storage,
  );
  assert.deepEqual(submitted, [500, 800]);
  assert.deepEqual(result, { bestScore: 800, submitted: true });
  assert.equal(entries.has(pendingKey('logic-circuit', 'alice')), false);
});

test('world claim copies a whole validated guest run only into a pristine account', () => {
  const { storage, entries } = memoryStorage();
  const guest = {
    ...emptyWorldSave(),
    position: { x: 2, z: 3 },
    collected: [worldShards[0].id],
    elapsed: 47,
  };
  saveWorldSave(storage, 'guest', guest);
  const claimed = claimGuestWorldSave(storage, 'alice');
  assert.deepEqual(claimed, guest);
  assert.deepEqual(loadWorldSave(storage, 'alice'), guest);
  assert.equal(entries.has('kep-games:world:guest'), false);
  assert.ok(isWorldSavePristine(claimGuestWorldSave(storage, 'bob')));
});

test('world claim preserves an existing account run and current unsaved guest state', () => {
  const { storage, entries } = memoryStorage();
  const account = { ...emptyWorldSave(), elapsed: 12, solved: [worldTerminals[0].id] };
  const guest = { ...emptyWorldSave(), elapsed: 9, collected: [worldShards[0].id] };
  saveWorldSave(storage, 'alice', account);
  saveWorldSave(storage, 'guest', guest);
  assert.deepEqual(claimGuestWorldSave(storage, 'alice'), account);
  assert.deepEqual(loadWorldSave(storage, 'guest'), guest);

  entries.delete('kep-games:world:alice');
  entries.delete('kep-games:world:guest');
  assert.deepEqual(claimGuestWorldSave(storage, 'bob', guest), guest);
  assert.deepEqual(loadWorldSave(storage, 'bob'), guest);
});
