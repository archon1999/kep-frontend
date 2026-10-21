import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapArenaPlayer } from './arena-player.mapper.ts';

test('arena standings read performance and both average rating API spellings', () => {
  const snake = mapArenaPlayer({ performance: 1904.06303, average_opponent_rating: 1787.7 });
  assert.equal(snake.performance, 1904.06303);
  assert.equal(snake.averageOpponentRating, 1787.7);
  assert.equal(mapArenaPlayer({ averageOpponentRating: '1700.5' }).averageOpponentRating, 1700.5);
});

test('missing performance differs from a played result of zero', () => {
  assert.equal(mapArenaPlayer({}).performance, null);
  assert.equal(mapArenaPlayer({ performance: 0 }).performance, 0);
});
