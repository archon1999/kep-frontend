import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDuelDuration } from './duel-format.ts';

test('formats backend duration strings for compact duel cards', () => {
  assert.equal(formatDuelDuration('02:00:00'), '2h');
  assert.equal(formatDuelDuration('01:30:00'), '1h 30m');
  assert.equal(formatDuelDuration('00:00:45'), '45s');
});

test('keeps unsupported duration values readable', () => {
  assert.equal(formatDuelDuration(undefined), '');
  assert.equal(formatDuelDuration('unknown'), 'unknown');
});
