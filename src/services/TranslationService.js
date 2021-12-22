import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/locales/en.json";
import vi from "../assets/locales/vi.json";

const resources = {
  en: en,
  vi: vi,
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (cb) => cb("en"),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next.use(languageDetector).use(initReactI18next).init({
  fallbackLng: "en",
  debug: false,
  resources: resources,
  nsSeparator: false,
});
