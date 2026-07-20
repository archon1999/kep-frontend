import assert from 'node:assert/strict';
import test from 'node:test';
import { canViewAttemptLog } from './attemptPermissions.ts';

test('attempt logs are visible to the attempt owner', () => {
  assert.equal(canViewAttemptLog({ username: 'owner' }, 'owner'), true);
});

test('superusers can view any attempt log', () => {
  assert.equal(
    canViewAttemptLog({ username: 'admin', isSuperuser: true }, 'owner'),
    true,
  );
});

test('attempt logs stay hidden from anonymous and unrelated users', () => {
  assert.equal(canViewAttemptLog(null, 'owner'), false);
  assert.equal(canViewAttemptLog({ username: 'someone-else' }, 'owner'), false);
});
