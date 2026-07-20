import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';

test('browser sanitizer removes executable HTML while preserving math content', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: dom.window,
  });

  try {
    // @ts-expect-error The query isolates DOMPurify's browser-bound module instance in this test.
    const { sanitizeRichHtml } = await import('./safeHtml.ts?browser-sanitizer');
    const sanitized = sanitizeRichHtml(`
      <p onclick="alert(1)">Pifagor: \\(x^2 + y^2 = z^2\\)</p>
      <a href="javascript:alert(2)">unsafe link</a>
      <img src="/formula.png" alt="formula" onerror="alert(3)">
      <script>alert(document.domain)</script>
      <math><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></math>
    `);

    assert.doesNotMatch(sanitized, /<script|alert\(document\.domain\)/i);
    assert.doesNotMatch(sanitized, /\son(?:click|error)\s*=/i);
    assert.doesNotMatch(sanitized, /javascript\s*:/i);
    assert.match(sanitized, /<p>Pifagor:/);
    assert.ok(sanitized.includes('\\(x^2 + y^2 = z^2\\)'));
    assert.match(
      sanitized,
      /<math><mrow><mi>x<\/mi><mo>\+<\/mo><mn>1<\/mn><\/mrow><\/math>/,
    );
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }

    dom.window.close();
  }
});
