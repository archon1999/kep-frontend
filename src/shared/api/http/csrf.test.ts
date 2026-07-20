import assert from 'node:assert/strict';
import test from 'node:test';
import { getCookieValue } from './csrf.ts';

test('getCookieValue reads and decodes the requested cookie', () => {
  assert.equal(
    getCookieValue('sessionid=private; csrftoken=token%2Fwith%2Bsymbols; language=uz', 'csrftoken'),
    'token/with+symbols',
  );
});

test('getCookieValue does not match cookie-name prefixes', () => {
  assert.equal(getCookieValue('old_csrftoken=wrong; sessionid=private', 'csrftoken'), null);
});
