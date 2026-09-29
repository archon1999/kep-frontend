import assert from 'node:assert/strict';
import test from 'node:test';
import { mapChallenge, mapRanking } from './world.mapper.ts';

const round = {
  prompt: 'Solve',
  difficulty: 10,
  round: 3,
  totalRounds: 7,
  roundId: 'server-round-3',
  deadlineAt: '2026-09-30T12:00:30Z',
};

test('brain challenge mapping preserves round identity and only exposes playable fields', () => {
  const comparison = mapChallenge({
    ...round,
    kind: 'math-compare',
    left: '7 × 3',
    right: '40 − 20',
    answer: 'left',
  });
  assert.deepEqual(comparison, { ...round, kind: 'math-compare', left: '7 × 3', right: '40 − 20' });
  const sequence = mapChallenge({
    ...round,
    kind: 'number-sequence',
    sequence: ['2', '4', '8'],
    answer: 16,
  });
  assert.deepEqual(sequence, { ...round, kind: 'number-sequence', sequence: [2, 4, 8] });
  const arithmetic = mapChallenge({ ...round, kind: 'quick-math', expression: '5 × 7', value: 35 });
  assert.deepEqual(arithmetic, { ...round, kind: 'quick-math', expression: '5 × 7' });
});

test('number hunt preserves rectangular grids and the server-confirmed next number', () => {
  const challenge = mapChallenge({
    ...round,
    kind: 'number-hunt',
    rows: 2,
    columns: 3,
    cells: [6, 3, 1, 4, 2, 5],
    next: 3,
  });
  assert.equal(challenge.kind, 'number-hunt');
  if (challenge.kind !== 'number-hunt') return;
  assert.equal(challenge.rows * challenge.columns, challenge.cells.length);
  assert.equal(challenge.next, 3);
});

test('memory recall cannot retain highlighted cells from a reveal response', () => {
  const data = {
    ...round,
    kind: 'memory-matrix',
    rows: 3,
    columns: 3,
    highlighted: [0, 2, 7],
    selected: [2],
    targetCount: 3,
    revealUntil: '2026-09-30T12:00:04Z',
  };
  const watch = mapChallenge({ ...data, phase: 'watch' });
  const recall = mapChallenge({ ...data, phase: 'recall' });
  assert.equal(watch.kind, 'memory-matrix');
  assert.equal(recall.kind, 'memory-matrix');
  if (watch.kind !== 'memory-matrix' || recall.kind !== 'memory-matrix') return;
  assert.deepEqual(watch.highlighted, [0, 2, 7]);
  assert.deepEqual(recall.highlighted, []);
  assert.deepEqual(recall.selected, [2]);
});

test('leaderboard keeps lifetime completion counts and the last task timestamp separate from XP achievement', () => {
  const data = {
    rank: 1,
    username: 'player',
    xp: 42,
    level: 2,
    achievedAt: '2026-09-29T10:00:00Z',
    completedTasks: 37,
    lastCompletedAt: '2026-09-30T09:00:00Z',
    isCurrentUser: true,
  };
  const player = mapRanking(data);
  assert.equal(player.completedTasks, 37);
  assert.equal(player.lastCompletedAt, '2026-09-30T09:00:00Z');
  assert.equal(player.achievedAt, '2026-09-29T10:00:00Z');
  const legacy = mapRanking({ ...data, completedTasks: undefined, lastCompletedAt: undefined });
  assert.equal(legacy.completedTasks, 0);
  assert.equal(legacy.lastCompletedAt, null);
});
