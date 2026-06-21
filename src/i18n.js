import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      de: {
        translation: deTranslation
      }
    },
    // Default language is English
    lng: localStorage.getItem('we_language') || 'en',
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
