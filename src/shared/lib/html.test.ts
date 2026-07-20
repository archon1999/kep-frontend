import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeHtmlEntities } from './html.ts';

test('decodeHtmlEntities decodes named and numeric entities', () => {
  assert.equal(decodeHtmlEntities('g&#39;olib'), "g'olib");
  assert.equal(decodeHtmlEntities('O&#x27;zbekiston &amp; KEP'), "O'zbekiston & KEP");
  assert.equal(decodeHtmlEntities('&quot;salom&quot;&nbsp;dunyo'), '"salom" dunyo');
});

test('decodeHtmlEntities handles legacy double encoding and preserves unknown entities', () => {
  assert.equal(decodeHtmlEntities('g&amp;#39;olib'), "g'olib");
  assert.equal(decodeHtmlEntities('a &custom; b'), 'a &custom; b');
});
