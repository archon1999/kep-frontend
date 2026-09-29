import assert from 'node:assert/strict';
import test from 'node:test';
import { isPlayableWorldChallenge } from '../../domain/utils/challenge.ts';
import {
  mapChallenge,
  mapLeaderboard,
  mapPointCooldowns,
  mapProfile,
  mapQuest,
  mapRanking,
  mapRun,
} from './world.mapper.ts';

const round = {
  prompt: 'Solve',
  difficulty: 10,
  round: 3,
  totalRounds: 7,
  roundId: 'server-round-3',
  deadlineAt: '2026-09-30T12:00:30Z',
};

test('paginated ranking preserves global ranks and does not append an off-page current user', () => {
  const player = { rank: 11, username: 'explorer', xp: 900, level: 4, completedTasks: 12 };
  const result = mapLeaderboard({
    top: [player],
    currentUser: { ...player, rank: 33, username: 'me', isCurrentUser: true },
    page: 2,
    pageSize: 10,
    totalPages: 4,
    totalPlayers: 33,
  });
  assert.equal(result.players.length, 1);
  assert.equal(result.players[0].rank, 11);
  assert.equal(result.currentUser?.rank, 33);
  assert.deepEqual(
    [result.page, result.pageSize, result.totalPages, result.totalPlayers],
    [2, 10, 4, 33],
  );
});

test('ranking tolerates the previous server response during a rolling deployment', () => {
  const result = mapLeaderboard({ top: [], totalPlayers: 0, currentUser: null });
  assert.deepEqual(result, {
    players: [],
    currentUser: null,
    totalPlayers: 0,
    page: 1,
    pageSize: 30,
    totalPages: 1,
  });
});

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

test('a newer server challenge produces an explicit refresh state while preserving the run', () => {
  const run = mapRun({
    id: 'active-run',
    questId: 'quest',
    kind: 'future-game',
    title: 'A new game',
    difficulty: 1,
    xp: 50,
    status: 'active',
    expiresAt: '2030-01-01T12:00:00Z',
    challenge: { kind: 'future-game', prompt: 'Try this game', secretAnswer: 12 },
  });
  assert.equal(run.id, 'active-run');
  assert.equal(run.status, 'active');
  assert.deepEqual(run.challenge, {
    kind: 'unsupported',
    originalKind: 'future-game',
    prompt: 'Try this game',
  });
  assert.equal(isPlayableWorldChallenge(run.challenge), false);
});

test('incomplete challenge payloads cannot render a blank board or throw from array decoding', () => {
  for (const kind of [
    'math-compare',
    'quick-math',
    'number-sequence',
    'number-hunt',
    'memory-matrix',
  ]) {
    const challenge = mapChallenge({ ...round, kind });
    assert.equal(challenge.kind, 'unsupported', kind);
    assert.equal(isPlayableWorldChallenge(challenge), false, kind);
  }
  assert.equal(mapChallenge(null).kind, 'unsupported');
  assert.equal(mapChallenge(undefined).kind, 'unsupported');
  assert.equal(
    mapChallenge({ ...round, kind: 'number-sequence', sequence: [NaN] }).kind,
    'unsupported',
  );
  assert.equal(
    mapChallenge({ ...round, kind: 'memory-matrix', highlighted: 'not-an-array' }).kind,
    'unsupported',
  );
});

test('legacy quest payloads remain playable alongside the five new mission kinds', () => {
  const cases = [
    { kind: 'bug-hunt', code: ['print(2 + 2)'], language: 'python', requiresFix: true },
    { kind: 'logic-circuit', inputs: ['A'], rows: [{ inputs: [0], output: 1 }], maxGates: 2 },
    { kind: 'code-islands', grid: ['S.G'], maxCommands: 2, startDirection: 'east' },
    { kind: 'memory-grid', rows: 3, columns: 3, phase: 'watch', reveal: { index: 0, cell: 2 } },
    {
      kind: 'cargo',
      items: [{ id: 'a', label: 'Crate', weight: 3, value: 4 }],
      capacity: 5,
      targetValue: 4,
    },
    { kind: 'daily-task', dailyTaskId: 42, href: '/daily-task/42' },
  ];
  for (const fields of cases) {
    const challenge = mapChallenge({ prompt: 'A mission', ...fields });
    assert.equal(challenge.kind, fields.kind);
    assert.equal(isPlayableWorldChallenge(challenge), true);
  }
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

test('point reward mapping preserves server-owned practice state and stable identity', () => {
  const run = mapRun({
    id: 'run',
    questId: 'replenished-quest',
    stationId: 'plaza-01',
    rewardEligible: false,
    rewardAvailableAt: '2026-10-01T10:00:00Z',
    xp: 0,
  });
  assert.equal(run.rewardEligible, false);
  assert.equal(run.xp, 0);
  assert.equal(run.stationId, 'plaza-01');
  assert.equal(run.rewardAvailableAt, '2026-10-01T10:00:00Z');
  const quest = mapQuest({ id: 'quest', stationId: 'plaza-01', position: { x: 8, z: 9 } });
  assert.equal(quest.stationId, 'plaza-01');
  assert.equal(mapProfile({ pointCount: 39 }).pointCount, 39);
  assert.deepEqual(
    mapPointCooldowns({
      pointCooldowns: {
        'plaza-01': '2026-10-01T10:00:00Z',
        invalid: 'nonsense',
        empty: null,
      },
    }),
    { 'plaza-01': '2026-10-01T10:00:00Z' },
  );
});
