import { SupportedLocales, initialConfig } from 'app/config.ts';
import { getItemFromStore } from 'shared/lib/utils';

export type I18nLanguage = 'enUS' | 'ruRU' | 'uzUZ';
export type BackendLanguage = 'en' | 'ru' | 'uz';

const I18N_LANGUAGE_BY_LOCALE: Record<SupportedLocales, I18nLanguage> = {
  'en-US': 'enUS',
  'ru-RU': 'ruRU',
  'uz-UZ': 'uzUZ',
};

const BACKEND_LANGUAGE_BY_LOCALE: Record<SupportedLocales, BackendLanguage> = {
  'en-US': 'en',
  'ru-RU': 'ru',
  'uz-UZ': 'uz',
};

export const normalizeSupportedLocale = (value?: string | null): SupportedLocales => {
  const normalized = `${value ?? ''}`.trim().replace('_', '-').toLowerCase();

  if (normalized.startsWith('ru')) return 'ru-RU';
  if (normalized.startsWith('uz')) return 'uz-UZ';
  if (normalized.startsWith('en')) return 'en-US';

  return initialConfig.locale;
};

export const getStoredLocale = (): SupportedLocales =>
  normalizeSupportedLocale(getItemFromStore('locale', initialConfig.locale) as string | null);

export const toI18nLanguage = (value?: string | null): I18nLanguage =>
  I18N_LANGUAGE_BY_LOCALE[normalizeSupportedLocale(value)];

export const toBackendLanguage = (value?: string | null): BackendLanguage =>
  BACKEND_LANGUAGE_BY_LOCALE[normalizeSupportedLocale(value)];
