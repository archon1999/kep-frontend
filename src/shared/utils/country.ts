import uzCountryLabels from 'shared/utils/countryLabels.uz';
import { getRegionDisplayName } from 'shared/lib/displayNames';

const normalizeLocale = (locale?: string) => {
  if (!locale) return 'en-US';
  const normalized = locale.replace('_', '-');

  const localeMap: Record<string, string> = {
    en: 'en-US',
    enUS: 'en-US',
    'en-US': 'en-US',
    ru: 'ru-RU',
    ruRU: 'ru-RU',
    'ru-RU': 'ru-RU',
    uz: 'uz-UZ',
    uzUZ: 'uz-UZ',
    'uz-UZ': 'uz-UZ',
  };

  if (localeMap[normalized]) {
    return localeMap[normalized];
  }

  if (normalized.includes('-')) return normalized;

  const match = normalized.match(/^(\w{2})([A-Z]{2})$/);

  if (match) {
    return `${match[1]}-${match[2]}`;
  }

  return normalized;
};

const sanitizeCountryCode = (code?: string) => code?.trim() ?? '';

export const getCountryAlpha2 = (code?: string): string | undefined => {
  const sanitized = sanitizeCountryCode(code);
  if (!sanitized) return undefined;

  const withoutFlagPrefix = sanitized.replace(/^flag:/i, '');
  const lettersOnly = withoutFlagPrefix.replace(/[^a-z]/gi, '');

  if (lettersOnly.length < 2) return undefined;

  return `${lettersOnly[0]}${lettersOnly[1]}`.toUpperCase();
};

export const getCountryLabel = (code?: string, locale?: string): string | undefined => {
  const alpha2Code = getCountryAlpha2(code);

  if (!alpha2Code) return undefined;

  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === 'uz-UZ' && uzCountryLabels[alpha2Code]) {
    return uzCountryLabels[alpha2Code];
  }

  return getRegionDisplayName(alpha2Code, normalizedLocale);
};
