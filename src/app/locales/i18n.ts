import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './langs/en';
import ruTranslation from './langs/ru';
import uzTranslation from './langs/uz';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      enUS: { translation: enTranslation },
      ruRU: { translation: ruTranslation },
      uzUZ: { translation: uzTranslation },
    },
    lng: 'enUS',
    ns: ['translation'],
    fallbackLng: 'enUS',
    debug: false,
  });

export default i18n;
