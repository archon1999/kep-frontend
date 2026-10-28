import assert from 'node:assert/strict';
import test from 'node:test';
import { displayFontFamily, fontFamilies, normalizeFontFamily } from './fonts.ts';

test('retired reading-font preferences migrate to Open Sans without changing pixel type', () => {
  for (const value of ['Roboto', 'Inter', 'Alpha Lyrae', undefined, null, 'unknown'])
    assert.equal(normalizeFontFamily(value), 'Open Sans');
  for (const family of fontFamilies) assert.equal(normalizeFontFamily(family), family);
  assert.match(displayFontFamily, /Alpha Lyrae/);
});
