import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { loadReadingFont } from './fontLoading.ts';

const { JSDOM } = createRequire(import.meta.url)('jsdom') as {
  JSDOM: new (html: string) => { window: { document: Document; close: () => void } };
};

test('default font needs no third party CSS and optional fonts load only once', () => {
  const dom = new JSDOM('<html><head></head></html>');
  const document = dom.window.document;
  loadReadingFont('Open Sans', document);
  assert.equal(document.querySelectorAll('link').length, 0);
  loadReadingFont('Manrope', document);
  loadReadingFont('Manrope', document);
  assert.equal(document.querySelectorAll('link').length, 1);
  assert.match(document.querySelector('link')!.href, /family=Manrope.*display=swap/);
  dom.window.close();
});
