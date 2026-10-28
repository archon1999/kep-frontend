import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import test from 'node:test';
import { useScopedAsyncTask } from './useScopedAsyncTask.ts';

test('scoped operations isolate requests, completion and timers', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const deferred = () => {
    let resolve!: (value: number) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<number>((yes, no) => {
      resolve = yes;
      reject = no;
    });
    return { promise, resolve, reject };
  };
  const mount = () => {
    const root = createRoot(document.createElement('div'));
    let task!: ReturnType<typeof useScopedAsyncTask>;
    const View = ({ scope }: { scope: string }) => {
      task = useScopedAsyncTask(scope);
      return null;
    };
    const render = (scope: string) => act(() => root.render(createElement(View, { scope })));
    render('problem:A');
    return { task: () => task, render, unmount: () => act(() => root.unmount()) };
  };
  try {
    await t.test('two clicks in the same render start only one request', async () => {
      const view = mount(),
        request = deferred();
      let calls = 0;
      const run = () => {
        calls++;
        return request.promise;
      };
      act(() => {
        void view.task().run(run);
        void view.task().run(run);
      });
      assert.equal(calls, 1);
      assert.equal(view.task().isPending, true);
      await act(async () => request.resolve(1));
      assert.equal(view.task().isPending, false);
      view.unmount();
    });
    await t.test(
      'navigation drops old success/error callbacks and preserves the new request',
      async () => {
        const view = mount(),
          old = deferred(),
          current = deferred();
        const values: number[] = [];
        act(() => {
          void view.task().run(() => old.promise, {
            onSuccess: (value) => {
              values.push(value);
            },
          });
        });
        view.render('problem:B');
        assert.equal(view.task().isPending, false);
        act(() => {
          void view.task().run(() => current.promise, {
            onSuccess: (value) => {
              values.push(value);
            },
          });
        });
        await act(async () => old.resolve(1));
        assert.deepEqual(values, []);
        assert.equal(view.task().isPending, true);
        await act(async () => current.resolve(2));
        assert.deepEqual(values, [2]);
        view.unmount();
      },
    );
    await t.test('unmount suppresses rejected requests', async () => {
      const view = mount(),
        request = deferred();
      let errors = 0;
      act(() => {
        void view.task().run(() => request.promise, {
          onError: () => {
            errors++;
          },
        });
      });
      view.unmount();
      await act(async () => request.reject(new Error('late failure')));
      assert.equal(errors, 0);
    });
    await t.test(
      'websocket completion cancels its timer without releasing a subsequent run',
      async (context) => {
        context.mock.timers.enable({ apis: ['setTimeout'] });
        const view = mount();
        await act(async () => {
          await view.task().run(async () => 1, { waitForResultMs: 50 });
        });
        act(() => context.mock.timers.tick(20));
        act(() => {
          assert.equal(view.task().complete(), true);
        });
        assert.equal(view.task().complete(), false);
        await act(async () => {
          await view.task().run(async () => 2, { waitForResultMs: 100 });
        });
        act(() => context.mock.timers.tick(50));
        assert.equal(view.task().isPending, true);
        act(() => context.mock.timers.tick(50));
        assert.equal(view.task().isPending, false);
        view.unmount();
      },
    );
    await t.test('a failed request clears busy state and can be retried', async () => {
      const view = mount(),
        errors: unknown[] = [];
      await act(async () => {
        await view.task().run(
          async () => {
            throw new Error('offline');
          },
          { onError: (error) => errors.push(error) },
        );
      });
      assert.equal(errors.length, 1);
      assert.equal(view.task().isPending, false);
      await act(async () => {
        await view.task().run(async () => 1);
      });
      assert.equal(view.task().isPending, false);
      view.unmount();
    });
  } finally {
    dom.window.close();
  }
});
