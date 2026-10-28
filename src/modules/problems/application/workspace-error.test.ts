import assert from 'node:assert/strict';
import test from 'node:test';
import { getWorkspaceErrorMessage } from './workspace-error.ts';

test('workspace errors prefer backend messages and safely fall back for unknown payloads', () => {
  assert.equal(
    getWorkspaceErrorMessage(
      { response: { data: { message: 'Compiler unavailable' } }, message: 'HTTP 500' },
      'Fallback',
    ),
    'Compiler unavailable',
  );
  assert.equal(getWorkspaceErrorMessage(new Error('Offline'), 'Fallback'), 'Offline');
  for (const error of [null, undefined, {}, { message: '' }, { message: { code: 5 } }]) {
    assert.equal(getWorkspaceErrorMessage(error, 'Fallback'), 'Fallback');
  }
});
