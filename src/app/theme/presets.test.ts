import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { normalizeThemePreset, resolveInitialMode, themePresets } from './presets.ts';

test('stored themes migrate to canonical names without losing legacy blue', () => {
  assert.equal(normalizeThemePreset('flames'), 'default');
  assert.equal(normalizeThemePreset('old-blue'), 'cobalt');
  assert.equal(normalizeThemePreset('default-light'), 'cobalt');
  assert.equal(normalizeThemePreset('default-dark'), 'cobalt');
  for (const preset of themePresets) assert.equal(normalizeThemePreset(preset), preset);
  for (const invalid of [null, undefined, {}, 'unknown'])
    assert.equal(normalizeThemePreset(invalid), 'default');
});

test('appearance stays independent of the preset, including system mode', () => {
  for (const preset of ['flames', 'default', 'default-light', 'default-dark', 'cobalt']) {
    for (const mode of ['light', 'dark', 'system'] as const)
      assert.equal(resolveInitialMode(preset, mode), mode);
  }
  assert.equal(resolveInitialMode('default-light', undefined), 'light');
  assert.equal(resolveInitialMode('default-dark', undefined), 'dark');
  assert.equal(resolveInitialMode(undefined, undefined), 'dark');
});

test('preload appearance agrees with settings migration before React mounts', () => {
  const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].find((match) =>
    match[1].includes('__kepSplashStartedAt'),
  )?.[1];
  assert.ok(script);
  for (const preset of [
    'flames',
    'default-light',
    'default-dark',
    'old-blue',
    'default',
    'cobalt',
  ]) {
    for (const mode of [undefined, 'light', 'dark', 'system', 'invalid']) {
      const attributes: Record<string, string> = {};
      runInNewContext(script, {
        window: { matchMedia: () => ({ matches: true }) },
        localStorage: {
          getItem: (key: string) =>
            key === 'themePreset' ? preset : key === 'kep-mode' ? (mode ?? null) : null,
        },
        document: {
          documentElement: {
            setAttribute: (key: string, value: string) => {
              attributes[key] = value;
            },
            style: { setProperty: () => {} },
          },
        },
      });
      const expected = resolveInitialMode(preset, mode);
      assert.equal(attributes['data-kep-color-scheme'], expected === 'system' ? 'dark' : expected);
    }
  }
});
