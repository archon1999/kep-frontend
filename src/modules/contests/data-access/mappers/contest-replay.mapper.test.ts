import assert from 'node:assert/strict';
import test from 'node:test';
import { mapContestReplay } from './contest-replay.mapper.ts';

test('delta frames preserve earlier states, names and ranks during reverse seeking', () => {
  const replay = mapContestReplay({
    available: true,
    reason: null,
    durationSeconds: 60,
    participantsCount: 2,
    source: 'history',
    participants: [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ],
    problems: ['A'],
    frames: [
      {
        at: 0,
        order: [1],
        ranks: [1],
        changes: [{ id: 1, points: 0, penalties: 0, problems: [] }],
      },
      {
        at: 10,
        order: [2],
        ranks: [1],
        changes: [
          {
            id: 2,
            points: 1,
            penalties: 10,
            problems: [{ symbol: 'A', points: 1, penalties: 10, attempts: 0, solved: true }],
          },
        ],
      },
      {
        at: 20,
        order: [1, 2],
        ranks: [1, 1],
        changes: [
          {
            id: 1,
            points: 1,
            penalties: 10,
            problems: [{ symbol: 'A', points: 1, penalties: 10, attempts: 0, solved: true }],
          },
        ],
      },
    ],
  });
  assert.equal(replay.frames[2].rows[0].points, 1);
  assert.equal(replay.frames[2].rows[1].name, 'Second');
  assert.equal(replay.frames[2].rows[1].rank, 1);
  assert.equal(replay.frames[0].rows[0].points, 0);
  assert.deepEqual(replay.frames[0].rows[0].problems, []);
  assert.equal(replay.frames[1].rows[0].penalties, 10);
});
