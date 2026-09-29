import assert from 'node:assert/strict';
import test from 'node:test';
import { worldKeys } from './keys.ts';

test('leaderboard cache isolates pages, periods and signed-in users', () => {
  const first = worldKeys.leaderboard('week', 'explorer', 1);
  for (const key of [
    worldKeys.leaderboard('week', 'explorer', 2),
    worldKeys.leaderboard('all', 'explorer', 1),
    worldKeys.leaderboard('week', 'other', 1),
    worldKeys.leaderboard('week', undefined, 1),
  ])
    assert.notDeepEqual(key, first);
});
