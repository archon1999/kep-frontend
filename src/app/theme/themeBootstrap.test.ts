import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const bootstrap = html.match(/<script id="kep-theme-bootstrap">([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap, 'The appearance migration must run in the initial document.');
const marker = 'kep-default-theme-applied-v1';

const runBootstrap = (storage: Pick<Storage, 'getItem' | 'setItem'>) => {
  const attributes = new Map<string, string>();
  runInNewContext(bootstrap, {
    localStorage: storage,
    window: { matchMedia: () => ({ matches: false }) },
    document: {
      documentElement: {
        setAttribute: (key: string, value: string) => attributes.set(key, value),
        style: { setProperty: () => {} },
      },
    },
  });
  return attributes;
};

const makeStorage = (values: Record<string, string> = {}) => {
  const entries = new Map(Object.entries(values));
  return {
    entries,
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  };
};

test('existing preferences migrate to the reference appearance before the first paint', () => {
  const storage = makeStorage({
    themePreset: 'cobalt',
    'kep-mode': 'light',
    navColor: 'vibrant',
    fontFamily: 'Open Sans',
    primaryColor: '#3d7cf4',
    locale: 'uz-UZ',
  });
  const attributes = runBootstrap(storage);
  assert.equal(storage.getItem('themePreset'), 'default');
  assert.equal(storage.getItem('kep-mode'), 'dark');
  assert.equal(storage.getItem('navColor'), 'default');
  assert.equal(storage.getItem('fontFamily'), 'Plus Jakarta Sans');
  assert.equal(JSON.parse(storage.getItem('primaryColor')!), null);
  assert.equal(JSON.parse(storage.getItem(marker)!), true);
  assert.equal(storage.getItem('locale'), 'uz-UZ');
  assert.equal(attributes.get('data-kep-color-scheme'), 'dark');
});

test('subsequent visits preserve the user’s new appearance choices', () => {
  const storage = makeStorage();
  runBootstrap(storage);
  for (const [key, value] of Object.entries({
    themePreset: 'luxury',
    'kep-mode': 'light',
    navColor: 'vibrant',
    fontFamily: 'Manrope',
    primaryColor: '#c4a15a',
  }))
    storage.setItem(key, value);
  const saved = [...storage.entries];
  assert.equal(runBootstrap(storage).get('data-kep-color-scheme'), 'light');
  assert.deepEqual([...storage.entries], saved);
});

test('an incomplete migration is retried instead of marking preferences as migrated', () => {
  const storage = makeStorage({ 'kep-mode': 'light' });
  runBootstrap({
    getItem: storage.getItem,
    setItem: (key, value) => {
      if (key === 'fontFamily') throw new Error('Storage quota exceeded');
      storage.setItem(key, value);
    },
  });
  assert.equal(storage.getItem(marker), null);
  runBootstrap(storage);
  assert.equal(storage.getItem('fontFamily'), 'Plus Jakarta Sans');
  assert.equal(storage.getItem('kep-mode'), 'dark');
  assert.equal(JSON.parse(storage.getItem(marker)!), true);
});

test('blocked storage does not prevent the initial theme document from rendering', () => {
  const fail = () => {
    throw new Error('Storage is disabled');
  };
  assert.equal(runBootstrap({ getItem: fail, setItem: fail }).get('data-kep-color-scheme'), 'dark');
});
