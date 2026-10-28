import type { BackendModule } from 'i18next';

// Explicit imports let Vite emit one cacheable dictionary per supported language.
const dictionaries = {
  'en-US': () => import('./langs/en'),
  'ru-RU': () => import('./langs/ru'),
  'uz-UZ': () => import('./langs/uz'),
};

export const translationBackend: BackendModule = {
  type: 'backend',
  init() {},
  read(language, namespace, callback) {
    const load = dictionaries[language as keyof typeof dictionaries];
    if (!load || namespace !== 'translation') {
      callback(new Error(`Unsupported translation resource: ${language}/${namespace}`), false);
      return;
    }
    load().then(
      ({ default: translations }) => callback(null, translations),
      (error: unknown) => callback(error instanceof Error ? error : new Error(String(error)), true),
    );
  },
};
