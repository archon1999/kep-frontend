import assert from 'node:assert/strict';
import test from 'node:test';
import { createSafeHtml, sanitizeRichHtml } from './safeHtml.ts';

test('sanitizeRichHtml uses a safe escaped fallback outside the browser', () => {
  assert.equal(
    sanitizeRichHtml('<img src=x onerror="alert(1)"><strong>safe</strong>'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&lt;strong&gt;safe&lt;/strong&gt;',
  );
});

test('createSafeHtml applies the safe escaped fallback', () => {
  assert.deepEqual(createSafeHtml('<script>alert(1)</script>'), {
    __html: '&lt;script&gt;alert(1)&lt;/script&gt;',
  });
});
