import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { loadModule } from '../testing/loadModule.ts';

const { JSDOM } = createRequire(import.meta.url)('jsdom');

async function inBrowser(
  run: (
    window: Window & { Event: typeof Event },
    renderer: typeof import('./mathJax.ts'),
  ) => Promise<void>,
) {
  const dom = new JSDOM(
    '<!doctype html><html><head><script id="mathjax-script"></script></head><body><div></div></body></html>',
  );
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  try {
    await run(dom.window, loadModule(new URL('./mathJax.ts', import.meta.url)));
  } finally {
    dom.window.close();
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument);
    else Reflect.deleteProperty(globalThis, 'document');
  }
}

test('formula views wait for the async script and its startup without adding duplicate scripts', () =>
  inBrowser(async (window, { loadMathJax }) => {
    const first = loadMathJax();
    assert.equal(loadMathJax(), first);
    let start!: () => void;
    window.MathJax = {
      typesetPromise: async () => {},
      startup: {
        promise: new Promise<void>((resolve) => {
          start = resolve;
        }),
      },
    };
    let complete = false;
    void first.then(() => {
      complete = true;
    });
    window.document.getElementById('mathjax-script')!.dispatchEvent(new window.Event('load'));
    await Promise.resolve();
    assert.equal(complete, false);
    start();
    assert.equal(await first, window.MathJax);
    assert.equal(window.document.querySelectorAll('script').length, 1);
  }));

test('an already available runtime still waits for startup', () =>
  inBrowser(async (window, { loadMathJax }) => {
    let start!: () => void;
    window.MathJax = {
      typesetPromise: async () => {},
      startup: {
        promise: new Promise<void>((resolve) => {
          start = resolve;
        }),
      },
    };
    let ready = false;
    const result = loadMathJax().then(() => {
      ready = true;
    });
    await Promise.resolve();
    assert.equal(ready, false);
    start();
    await result;
    assert.equal(ready, true);
  }));

test('typesetting serializes active previews and skips views closed while the script loads', () =>
  inBrowser(async (window, { typesetMath }) => {
    const element = window.document.querySelector('div')!;
    let current = true;
    let calls = 0;
    let active = 0;
    const outdated = typesetMath(element, () => current);
    await Promise.resolve();
    current = false;
    window.MathJax = {
      typesetPromise: async () => {
        active += 1;
        assert.equal(active, 1);
        calls += 1;
        await Promise.resolve();
        active -= 1;
      },
    };
    window.document.getElementById('mathjax-script')!.dispatchEvent(new window.Event('load'));
    await Promise.all([
      outdated,
      typesetMath(element, () => true),
      typesetMath(element, () => true),
    ]);
    assert.equal(calls, 2);
  }));

test('failed downloads reject and release the shared loader for later attempts', () =>
  inBrowser(async (window, { loadMathJax }) => {
    const result = assert.rejects(loadMathJax(), /Unable to load/);
    window.document.getElementById('mathjax-script')!.dispatchEvent(new window.Event('error'));
    await result;
    window.MathJax = { typesetPromise: async () => {} };
    assert.equal(await loadMathJax(), window.MathJax);
  }));

test('preview cleanup waits for an in-flight typeset before clearing its document', () =>
  inBrowser(async (window, { typesetMath, clearMath }) => {
    let finish!: () => void;
    let started!: () => void;
    const running = new Promise<void>((resolve) => {
      started = resolve;
    });
    const calls: string[] = [];
    window.MathJax = {
      typesetPromise: async () => {
        calls.push('start');
        started();
        await new Promise<void>((resolve) => {
          finish = resolve;
        });
        calls.push('finish');
      },
      typesetClear: () => {
        calls.push('clear');
      },
    };
    const element = window.document.querySelector('div')!;
    const render = typesetMath(element, () => true);
    await running;
    const cleanup = clearMath(element);
    await Promise.resolve();
    assert.deepEqual(calls, ['start']);
    finish();
    await Promise.all([render, cleanup]);
    assert.deepEqual(calls, ['start', 'finish', 'clear']);
  }));
