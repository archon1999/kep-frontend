import assert from 'node:assert/strict';
import test from 'node:test';
import {
  defaultFontFamily,
  displayFontFamily,
  fontFamilies,
  normalizeFontFamily,
} from './fonts.ts';

test('retired reading-font preferences use the default without changing pixel type', () => {
  for (const value of ['Roboto', 'Inter', 'Alpha Lyrae', undefined, null, 'unknown'])
    assert.equal(normalizeFontFamily(value), defaultFontFamily);
  for (const family of fontFamilies) assert.equal(normalizeFontFamily(family), family);
  assert.match(displayFontFamily, /Alpha Lyrae/);
});
