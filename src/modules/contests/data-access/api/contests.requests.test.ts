import assert from 'node:assert/strict';
import test from 'node:test';
import { cancelContestRegistrationRequest } from './contests.requests.ts';

test('contest registration cancellation uses DELETE', () => {
  assert.deepEqual(cancelContestRegistrationRequest(42), {
    url: '/api/contests/42/cancel-registration/',
    method: 'DELETE',
  });
});
