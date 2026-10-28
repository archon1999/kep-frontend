import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getStoredLocale, toI18nLanguage } from './locale';
import { translationBackend } from './translationBackend';

const fallbackLanguage = toI18nLanguage('en-US');
const initialLanguage = toI18nLanguage(getStoredLocale());

i18n
  .use(translationBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    ns: ['translation'],
    fallbackLng: fallbackLanguage,
    supportedLngs: ['en-US', 'ru-RU', 'uz-UZ'],
    load: 'currentOnly',
    debug: false,
  });

export default i18n;
