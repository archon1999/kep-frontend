import assert from 'node:assert/strict';
import test from 'node:test';
import type { ContestantEntity } from '../entities/contestant.entity';
import { contestantMatchesUsername, getStandingsRowId, normalizeUsername } from './standings.ts';

test('official, virtual, and upsolve rows do not collide for the same contestant', () => {
  const row: ContestantEntity = { id: 7, username: 'alice', problemsInfo: [] };
  const ids = [row, { ...row, virtualTime: '12:30' }, { ...row, rowType: 'upsolve' as const }].map(
    getStandingsRowId,
  );
  assert.equal(new Set(ids).size, 3);
  assert.notEqual(
    getStandingsRowId({ ...row, id: undefined }),
    getStandingsRowId({ ...row, id: undefined, username: 'bob' }),
  );
});

test('participant links locate an individual or team member without matching empty names', () => {
  const row: ContestantEntity = {
    username: ' Team ',
    problemsInfo: [],
    team: { members: [{ username: 'Alice' }, {}] },
  };
  assert.equal(contestantMatchesUsername(row, normalizeUsername(' ALICE ')), true);
  assert.equal(contestantMatchesUsername(row, normalizeUsername('team')), true);
  assert.equal(contestantMatchesUsername(row, 'bob'), false);
  assert.equal(contestantMatchesUsername(row, normalizeUsername(null)), false);
});
