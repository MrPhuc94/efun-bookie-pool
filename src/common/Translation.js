import i18next from "i18next";

export function t(name, params = {}) {
  return i18next.t(name, params);
}

export function changeI18nLanguage(lang) {
  i18next.locale = lang;
  // RNRestart.Restart()
}

export default i18next;
