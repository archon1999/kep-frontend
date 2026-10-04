import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import test, { type TestContext } from 'node:test';
import useDebouncedInput from './useDebouncedInput.ts';

test('search drafts stay responsive while committing only completed input', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  const globals = {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const originals = Object.fromEntries(
    Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
  );
  Object.entries(globals).forEach(([key, value]) => {
    Object.defineProperty(globalThis, key, { configurable: true, value });
  });

  const mount = (context: TestContext, initialValue = '') => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    const container = document.createElement('div');
    const root = createRoot(container);
    const commits: string[] = [];
    let input: ReturnType<typeof useDebouncedInput>;
    let parentRenders = 0;

    const Input = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
      input = useDebouncedInput(value, onChange, 40);
      return createElement('span', null, input.value);
    };
    const Parent = (props: { value: string; onChange: (value: string) => void }) => {
      parentRenders += 1;
      return createElement(Input, props);
    };
    const render = (value: string, onChange = (nextValue: string) => commits.push(nextValue)) => {
      act(() => root.render(createElement(Parent, { value, onChange })));
    };
    render(initialValue);
    context.after(() => act(() => root.unmount()));

    return {
      commits,
      render,
      input: () => input,
      text: () => container.textContent,
      parentRenders: () => parentRenders,
      advance: (ms: number) => act(() => context.mock.timers.tick(ms)),
      type: (value: string) => act(() => input.setValue(value)),
      unmount: () => act(() => root.unmount()),
    };
  };

  try {
    await t.test(
      'rapid typing keeps every character without rerendering the results',
      (context) => {
        const view = mount(context);
        const query = 'algorithm regression';
        for (let length = 1; length <= query.length; length += 1) {
          view.type(query.slice(0, length));
          view.advance(5);
          assert.equal(view.text(), query.slice(0, length));
        }
        assert.equal(view.parentRenders(), 1);
        assert.deepEqual(view.commits, []);
        view.advance(40);
        assert.deepEqual(view.commits, [query]);
      },
    );

    await t.test(
      'a changed callback uses the latest filters without restarting the timer',
      (context) => {
        const view = mount(context);
        view.type('search');
        view.advance(20);
        view.render('', (value) => view.commits.push(`latest:${value}`));
        view.advance(20);
        assert.deepEqual(view.commits, ['latest:search']);
      },
    );

    await t.test(
      'external navigation replaces the draft and cancels its pending search',
      (context) => {
        const view = mount(context, 'old');
        view.type('unfinished');
        view.render('restored');
        assert.equal(view.text(), 'restored');
        view.advance(100);
        assert.deepEqual(view.commits, []);
      },
    );

    await t.test('a delayed URL update preserves text typed after submission', (context) => {
      const view = mount(context);
      view.type('first');
      view.advance(40);
      view.type('first second');
      view.render('first');
      assert.equal(view.text(), 'first second');
      view.advance(40);
      assert.deepEqual(view.commits, ['first', 'first second']);
    });

    await t.test('composition does not submit unfinished text', (context) => {
      const view = mount(context);
      act(() => view.input().setIsComposing(true));
      view.type('日本語');
      view.advance(100);
      assert.deepEqual(view.commits, []);
      act(() => view.input().setIsComposing(false));
      view.advance(40);
      assert.deepEqual(view.commits, ['日本語']);
    });

    await t.test('Enter submits immediately without a duplicate delayed submission', (context) => {
      const view = mount(context);
      view.type('search');
      act(() => view.input().commit());
      assert.deepEqual(view.commits, ['search']);
      view.advance(100);
      assert.deepEqual(view.commits, ['search']);
    });

    await t.test('clearing submits immediately and cancels the unfinished search', (context) => {
      const view = mount(context, 'old');
      view.type('unfinished');
      view.type('');
      assert.equal(view.text(), '');
      assert.deepEqual(view.commits, ['']);
      view.advance(100);
      assert.deepEqual(view.commits, ['']);
    });

    await t.test('leaving the page cancels a pending search', (context) => {
      const view = mount(context);
      view.type('unfinished');
      view.unmount();
      view.advance(100);
      assert.deepEqual(view.commits, []);
    });
  } finally {
    Object.keys(globals).forEach((key) => {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]!);
      else Reflect.deleteProperty(globalThis, key);
    });
    dom.window.close();
  }
});
