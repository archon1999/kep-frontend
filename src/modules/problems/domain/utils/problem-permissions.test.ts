import assert from 'node:assert/strict';
import test from 'node:test';
import { parseProblemPermissions } from './problem-permissions.ts';

test('invalid or absent permissions never grant workspace capabilities', () => {
  for (const value of [null, undefined, '', '{broken', 'null', '[]', [], 123]) {
    assert.deepEqual(parseProblemPermissions(value), {
      canCreateProblems: false,
      canChangeProblemTags: false,
      canUseCheckSamples: false,
    });
  }
});
test('both serialized legacy and current permissions are supported', () => {
  assert.equal(parseProblemPermissions('{"can_use_check_samples":true}').canUseCheckSamples, true);
  assert.equal(parseProblemPermissions({ canUseCheckSamples: true }).canUseCheckSamples, true);
  assert.equal(
    parseProblemPermissions({ canUseCheckSamples: false, can_use_check_samples: true })
      .canUseCheckSamples,
    false,
  );
});
