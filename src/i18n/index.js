import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import en from './en.json';
import ar from './ar.json';
import ber from './ber.json';

const saved = localStorage.getItem('bek-lang');

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en }, ar: { translation: ar }, ber: { translation: ber } },
  fallbackLng: 'fr',
  lng: saved || 'fr',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export default i18n;
