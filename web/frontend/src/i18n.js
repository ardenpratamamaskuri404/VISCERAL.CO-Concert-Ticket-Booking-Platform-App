import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import idTranslations from './locales/id.json';
import enTranslations from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      id: { translation: idTranslations }
    },
    lng: 'id',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
