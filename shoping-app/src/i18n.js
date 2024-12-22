import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import jazykových překladů
import en from "./locales/en.json";
import cs from "./locales/cs.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
  },
  lng: "en", // Výchozí jazyk
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
