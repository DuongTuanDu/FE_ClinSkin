import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Import English translations
import enAboutUs from './en/aboutUs.json'

// Import Vietnamese translations
import viAboutUs from './vi/aboutUs.json'

const resources = {
  en: {
    aboutUs: enAboutUs,
  },
  vi: {
    aboutUs: viAboutUs,
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // Sử dụng namespace để tách biệt các file
    defaultNS: 'common',
    ns: [
      'aboutUs',
    ],
    interpolation: {
      escapeValue: false
    }
  })

export default i18n