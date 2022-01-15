import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/locales/en.json";
import id from "../assets/locales/id.json";
import kr from "../assets/locales/kr.json";
import ir from "../assets/locales/ir.json";
import pl from "../assets/locales/pl.json";
import jp from "../assets/locales/jp.json";
import cn from "../assets/locales/cn.json";
import fr from "../assets/locales/fr.json";

const resources = {
  en: en,
  id: id,
  kr: kr,
  ir: ir,
  pl: pl,
  jp: jp,
  cn: cn,
  fr: fr,
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
