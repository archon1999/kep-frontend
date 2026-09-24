import assert from 'node:assert/strict';
import test from 'node:test';
import { LocalGameProgressRepository } from './progress.repository.impl.ts';

test('current course sanitizes completed islands, stars, and drafts', () => {
  const original = globalThis.localStorage;
  const storage = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => void storage.set(key, value),
  } as Storage;

  try {
    storage.set(
      'kepper-code-islands:progress:test-player',
      JSON.stringify({
        completed: [1, 1, 2, 3, 10, 15, 16, -1],
        stars: { 1: 1000000, 2: -8, 10: 2 },
        drafts: { 1: 42, 2: 'move\nright', 3: 'move', 10: 'jump', 15: 'retired' },
      }),
    );
    const progress = new LocalGameProgressRepository().load('test-player');
    assert.deepEqual(progress.completed, [1, 2, 3, 10]);
    assert.deepEqual(progress.stars, { 1: 3, 2: 1, 3: 1, 10: 2 });
    assert.deepEqual(progress.drafts, { 2: 'move\nright', 3: 'move', 10: 'jump' });
  } finally {
    globalThis.localStorage = original;
  }
});

test('progress is saved and loaded under one unversioned key', () => {
  const original = globalThis.localStorage;
  const storage = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => void storage.set(key, value),
  } as Storage;

  try {
    const repository = new LocalGameProgressRepository();
    const progress = {
      completed: [1, 10],
      stars: { 1: 2, 10: 3 },
      drafts: { 9: 'move', 10: 'jump' },
    };
    repository.save('test-player', progress);
    assert.equal(storage.size, 1);
    assert.ok(storage.has('kepper-code-islands:progress:test-player'));
    assert.deepEqual(repository.load('test-player'), progress);
  } finally {
    globalThis.localStorage = original;
  }
});

test('guest islands are claimed once by an empty account after sanitizing progress', () => {
  const original = globalThis.localStorage;
  const entries = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
  } as Storage;

  try {
    entries.set(
      'kepper-code-islands:progress:guest',
      JSON.stringify({
        completed: [1, 2, 10],
        stars: { 1: 3, 2: 9 },
        drafts: { 2: 'move', 10: 'jump' },
      }),
    );
    const repository = new LocalGameProgressRepository();
    assert.deepEqual(repository.load('alice'), {
      completed: [1, 2, 10],
      stars: { 1: 3, 2: 3, 10: 1 },
      drafts: { 2: 'move', 10: 'jump' },
    });
    assert.equal(entries.has('kepper-code-islands:progress:guest'), false);
    assert.equal(entries.get('kepper-code-islands:guest-claim'), 'alice');
    assert.deepEqual(repository.load('bob'), { completed: [], stars: {}, drafts: {} });

    repository.save('guest', { completed: [10], stars: { 10: 2 }, drafts: {} });
    assert.deepEqual(repository.load('bob'), {
      completed: [10],
      stars: { 10: 2 },
      drafts: {},
    });
  } finally {
    globalThis.localStorage = original;
  }
});

test('guest islands never overwrite meaningful account progress', () => {
  const original = globalThis.localStorage;
  const entries = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
  } as Storage;

  try {
    entries.set(
      'kepper-code-islands:progress:guest',
      JSON.stringify({
        completed: [1, 2],
        stars: { 1: 3, 2: 2 },
        drafts: {},
      }),
    );
    entries.set(
      'kepper-code-islands:progress:alice',
      JSON.stringify({
        completed: [1],
        stars: { 1: 2 },
        drafts: { 2: 'right' },
      }),
    );
    const repository = new LocalGameProgressRepository();
    assert.deepEqual(repository.load('alice'), {
      completed: [1],
      stars: { 1: 2 },
      drafts: { 2: 'right' },
    });
    assert.ok(entries.has('kepper-code-islands:progress:guest'));
    assert.deepEqual(repository.load('alice').completed, [1]);
  } finally {
    globalThis.localStorage = original;
  }
});
