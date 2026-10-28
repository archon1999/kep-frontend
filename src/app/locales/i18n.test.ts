import { createInstance, type i18n } from 'i18next';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const localeDirectory = dirname(fileURLToPath(import.meta.url));

// Execute the actual configuration and dictionaries, replacing only browser storage
// and app-shell imports so this regression test can run without a DOM or bundler.
const loadConfiguredI18n = async (storedLocale: string): Promise<i18n> => {
  const instance = createInstance();
  const cache = new Map<string, { exports: Record<string, unknown> }>();
  const load = (file: string): Record<string, unknown> => {
    const cached = cache.get(file);
    if (cached) return cached.exports;
    if (file.endsWith('.json'))
      return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    const module = { exports: {} };
    cache.set(file, module);
    const source = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText;
    const localRequire = (specifier: string) => {
      if (specifier === 'i18next') return instance;
      if (specifier === 'app/config.ts') return { initialConfig: { locale: 'en-US' } };
      if (specifier === 'shared/lib/utils') return { getItemFromStore: () => storedLocale };
      if (!specifier.startsWith('.')) return require(specifier);
      const target = resolve(dirname(file), specifier);
      return load(
        target.endsWith('.json')
          ? target
          : /\/langs\/(en|uz|ru)$/.test(target.replace(/\\/g, '/'))
            ? resolve(target, 'index.ts')
            : `${target}.ts`,
      );
    };
    new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
    return module.exports;
  };
  load(resolve(localeDirectory, 'i18n.ts'));
  if (!instance.isInitialized)
    await new Promise<void>((done) => instance.on('initialized', () => done()));
  return instance;
};

test('legacy locale preferences resolve to standard language codes and native plurals', async () => {
  const cases = [
    ['enUS', 'en-US', ['1 challenge', '2 challenges', '5 challenges', '21 challenges']],
    ['ruRU', 'ru-RU', ['1 поединок', '2 поединка', '5 поединков', '21 поединок']],
    ['uzUZ', 'uz-UZ', ['1 ta bellashuv', '2 ta bellashuv', '5 ta bellashuv', '21 ta bellashuv']],
  ] as const;
  for (const [stored, expectedLanguage, expectedLabels] of cases) {
    const instance = await loadConfiguredI18n(stored);
    assert.equal(instance.language, expectedLanguage);
    assert.deepEqual(
      [1, 2, 5, 21].map((count) => instance.t('challenges.statisticsPage.streakCount', { count })),
      expectedLabels,
    );
    for (const key of [
      'notifications.challengeFinishedDescription',
      'common.dailyTasks.subtitle',
      'problems.detail.targetImageMissing',
    ]) {
      assert.equal(
        instance.exists(key, { fallbackLng: false }),
        true,
        `${expectedLanguage}: ${key}`,
      );
    }
  }
});

test('dynamic question-type copy and all verdict titles remain available in each language', async () => {
  for (const language of ['en-US', 'ru-RU', 'uz-UZ']) {
    const instance = await loadConfiguredI18n(language);
    for (const key of [
      'challenges.statisticsPage.questionTypes.conformity',
      'problems.attempts.verdictTitles.accepted',
      'problems.attempts.verdictTitles.partial',
    ]) {
      const value = instance.t(key, { fallbackLng: false });
      assert.notEqual(value, key);
      assert.ok(value.trim());
    }
    assert.notEqual(
      instance.t('notifications.challengeFinished'),
      instance.t('notifications.challengeFinishedDescription'),
    );
  }
});
