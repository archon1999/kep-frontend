import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createMemoryRouter } from 'react-router';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import test from 'node:test';
import { useProblemWorkspaceRoute } from './useProblemWorkspaceRoute.ts';

test('workspace filters and pagination update atomically and preserve navigation context', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  let model!: ReturnType<typeof useProblemWorkspaceRoute>;
  const View = () => {
    model = useProblemWorkspaceRoute();
    return null;
  };
  const router = createMemoryRouter([{ path: '/problems/:id', element: createElement(View) }], {
    initialEntries: ['/problems/1?study-plan=5&tab=attempts&attemptsPage=4&attemptsPageSize=20'],
  });
  const root = createRoot(document.createElement('div'));
  try {
    await act(async () => root.render(createElement(RouterProvider, { router })));
    assert.equal(model.attemptsPagination.page, 3);
    await act(async () => model.handleAttemptsLangFilterChange('py'));
    assert.equal(model.attemptsLangFilter, 'py');
    assert.equal(model.attemptsPagination.page, 0);
    assert.equal(model.attemptsPagination.pageSize, 20);
    assert.equal(new URLSearchParams(router.state.location.search).get('study-plan'), '5');
    assert.equal(model.activeTab, 'attempts');
    await act(async () => model.onAttemptsPaginationChange({ page: 2, pageSize: 20 }));
    await act(async () => model.handleAttemptsVerdictFilterChange('1'));
    assert.equal(model.attemptsLangFilter, 'py');
    assert.equal(model.attemptsVerdictFilter, '1');
    assert.equal(model.attemptsPagination.page, 0);
    await act(async () => model.onAttemptsPaginationChange({ page: 2, pageSize: 20 }));
    await act(async () => model.handleToggleMyAttempts());
    assert.equal(model.myAttemptsOnly, false);
    assert.equal(model.attemptsPagination.page, 0);
    await act(async () => model.handleTabChange('code'));
    await act(async () => router.navigate(-1));
    assert.equal(model.activeTab, 'attempts');
    assert.equal(model.myAttemptsOnly, false);
  } finally {
    act(() => root.unmount());
    router.dispose();
    dom.window.close();
  }
});
