import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule } from '../../shared/testing/loadModule.ts';

test('account outages preserve the signed-in user and real expiry permits recovery', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://kep.test' });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const user = { username: 'user_s' };
  let data: unknown = user;
  let error: unknown;
  const mutate = async (...args: unknown[]) => {
    if (args.length) data = args[0];
    return data;
  };
  const element = ({ children }: any) => createElement('div', null, children);
  const { default: Provider, useAuth } = loadModule(
    new URL('./AuthProvider.tsx', import.meta.url),
    {
      '@mui/material': { Alert: element, Button: element, Snackbar: element, Stack: element },
      'react-i18next': { useTranslation: () => ({ t: (key: string) => key }) },
      'app/config.ts': { initialConfig: { assetsDir: '/assets' } },
      'shared/lib/utils': { removeItemFromStore: () => {} },
      'shared/services/websocket': { wsService: { setEnabled: () => {} } },
      'shared/lib/authRedirect': { useLoginRedirect: () => () => {} },
      'modules/authentication/application': {
        useCurrentUser: () => ({ data, error, isLoading: false, mutate }),
        useLogOutUser: () => ({ trigger: async () => {} }),
      },
    },
  );
  let auth: any;
  const Probe = () => {
    auth = useAuth();
    return null;
  };
  const root = createRoot(document.createElement('div'));
  const render = () => act(() => root.render(createElement(Provider, null, createElement(Probe))));
  try {
    render();
    assert.equal(auth.currentUser.username, 'user_s');
    error = { status: 503 };
    render();
    assert.equal(auth.currentUser.username, 'user_s');
    assert.equal(auth.sessionExpired, false);
    assert.equal(auth.authError, error);
    data = null;
    error = undefined;
    render();
    assert.equal(auth.currentUser.username, 'user_s');
    assert.equal(auth.sessionExpired, true);
    data = { ...user };
    render();
    await act(async () => {
      await auth.refreshCurrentUser();
    });
    assert.equal(auth.sessionExpired, false);
    act(() => auth.setCurrentUser({ username: 'replacement' }));
    assert.equal(auth.currentUser.username, 'replacement');
    data = { username: 'replacement' };
    render();
    await act(async () => {
      await auth.signout();
    });
    assert.equal(auth.currentUser, null);
    assert.equal(auth.sessionExpired, false);
  } finally {
    act(() => root.unmount());
    dom.window.close();
  }
});
