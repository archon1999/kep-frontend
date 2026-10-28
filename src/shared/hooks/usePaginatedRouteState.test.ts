import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import test from 'node:test';
import { booleanFlagParam, stringParam } from '../lib/queryParams.ts';
import usePaginatedRouteState from './usePaginatedRouteState.ts';

test('paginated filters preserve route state through filtering and navigation', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  const globals = {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const originals = Object.fromEntries(
    Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
  );
  Object.entries(globals).forEach(([key, value]) =>
    Object.defineProperty(globalThis, key, { configurable: true, value }),
  );

  type Filters = { lang: string; following: boolean };
  const mount = (url: string) => {
    const root = createRoot(document.createElement('div'));
    let model: ReturnType<typeof usePaginatedRouteState<Filters>>;
    let navigate: ReturnType<typeof useNavigate>;
    let location: ReturnType<typeof useLocation>;
    const Probe = () => {
      model = usePaginatedRouteState<Filters>({
        defaults: { lang: '', following: false },
        schema: { lang: stringParam(), following: booleanFlagParam() },
      });
      navigate = useNavigate();
      location = useLocation();
      return null;
    };
    act(() =>
      root.render(createElement(MemoryRouter, { initialEntries: [url] }, createElement(Probe))),
    );
    return {
      model: () => model,
      params: () => new URLSearchParams(location.search),
      navigate: (to: number | string) =>
        act(() => {
          if (typeof to === 'number') void navigate(to);
          else void navigate(to);
        }),
      unmount: () => act(() => root.unmount()),
    };
  };

  try {
    await t.test(
      'changing a filter on a later page is atomic and retains unrelated URL values',
      () => {
        const view = mount('/attempts?page=4&pageSize=50&lang=cpp&tab=attempts');
        try {
          assert.deepEqual(view.model().paginationModel, { page: 3, pageSize: 50 });
          act(() => view.model().patchFilters({ lang: 'python', following: true }));
          assert.equal(view.model().state.lang, 'python');
          assert.equal(view.model().state.following, true);
          assert.deepEqual(view.model().pageParams, { page: 1, pageSize: 50 });
          assert.equal(view.params().get('tab'), 'attempts');
          assert.equal(view.params().has('page'), false);
        } finally {
          view.unmount();
        }
      },
    );
    await t.test('clear resets all filters and page but preserves the selected page size', () => {
      const view = mount('/standings?page=3&pageSize=100&lang=cpp&following=true&extra=kept');
      try {
        act(() => view.model().resetFilters());
        assert.equal(view.model().state.lang, '');
        assert.equal(view.model().state.following, false);
        assert.deepEqual(view.model().pageParams, { page: 1, pageSize: 100 });
        assert.equal(view.params().get('extra'), 'kept');
      } finally {
        view.unmount();
      }
    });
    await t.test('back and forward restore both filter and pagination state', () => {
      const view = mount('/problems?lang=cpp');
      try {
        act(() => view.model().onPaginationModelChange({ page: 2, pageSize: 50 }));
        act(() => view.model().patchFilters({ lang: 'python' }));
        view.navigate(-1);
        assert.equal(view.model().state.lang, 'cpp');
        assert.deepEqual(view.model().pageParams, { page: 1, pageSize: 20 });
        view.navigate(1);
        assert.equal(view.model().state.lang, 'python');
        assert.deepEqual(view.model().pageParams, { page: 1, pageSize: 50 });
      } finally {
        view.unmount();
      }
    });
    await t.test('server-located pages preserve filters and invalid URL pages use defaults', () => {
      const view = mount('/standings?page=-5&pageSize=bad&lang=cpp');
      try {
        assert.deepEqual(view.model().pageParams, { page: 1, pageSize: 20 });
        act(() => view.model().setPage(4));
        assert.deepEqual(view.model().paginationModel, { page: 3, pageSize: 20 });
        assert.equal(view.model().state.lang, 'cpp');
        view.navigate('/standings?page=2&pageSize=10&following=true');
        assert.equal(view.model().state.following, true);
        assert.deepEqual(view.model().pageParams, { page: 2, pageSize: 10 });
      } finally {
        view.unmount();
      }
    });
  } finally {
    Object.keys(globals).forEach((key) => {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]!);
      else Reflect.deleteProperty(globalThis, key);
    });
    dom.window.close();
  }
});
