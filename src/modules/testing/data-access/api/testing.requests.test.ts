import assert from 'node:assert/strict';
import test from 'node:test';
import { finishTestRequest, startTestRequest } from './testing.requests.ts';

test('starting a test uses POST', () => {
  assert.deepEqual(startTestRequest(7), {
    url: '/api/tests/7/start/',
    method: 'POST',
  });
});

test('finishing a test pass uses POST', () => {
  assert.deepEqual(finishTestRequest(19), {
    url: '/api/test-pass/19/finish/',
    method: 'POST',
  });
});
