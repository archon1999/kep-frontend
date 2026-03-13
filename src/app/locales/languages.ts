import { SupportedLocales } from 'app/config.ts';

export interface SupportedLanguage {
  label: string;
  shortLabel: string;
  icon: string;
  locale: SupportedLocales;
  currency: string;
  currencySymbol: string;
}
export const languages: SupportedLanguage[] = [
  {
    label: 'English',
    shortLabel: 'eng',
    icon: 'twemoji:flag-united-kingdom',
    locale: 'en-US',
    currency: 'USD',
    currencySymbol: '$',
  },
  {
    label: 'Русский',
    shortLabel: 'rus',
    icon: 'twemoji:flag-russia',
    locale: 'ru-RU',
    currency: 'RUB',
    currencySymbol: '₽',
  },
  {
    label: "O'zbekcha",
    shortLabel: 'uzb',
    icon: 'twemoji:flag-uzbekistan',
    locale: 'uz-UZ',
    currency: 'UZS',
    currencySymbol: "so'm",
  },
];
