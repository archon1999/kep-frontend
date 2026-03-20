import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getStoredLocale, toI18nLanguage } from './locale';
import enTranslation from './langs/en';
import ruTranslation from './langs/ru';
import uzTranslation from './langs/uz';

const fallbackLanguage = toI18nLanguage('en-US');
const initialLanguage = toI18nLanguage(getStoredLocale());

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      enUS: { translation: enTranslation },
      ruRU: { translation: ruTranslation },
      uzUZ: { translation: uzTranslation },
    },
    lng: initialLanguage,
    ns: ['translation'],
    fallbackLng: fallbackLanguage,
    supportedLngs: ['enUS', 'ruRU', 'uzUZ'],
    debug: false,
  });

export default i18n;
