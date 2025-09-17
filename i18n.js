const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const path = require("path");

i18next.use(Backend).init({
  initImmediate: false, // importante si lo usás en un entorno síncrono
  lng: "es", // idioma por defecto
  ns: ["contexto_actual", "personalidades",],
  defaultNS: "personalidades",
  fallbackLng: "en",
  backend: {
    loadPath: path.join(__dirname, "/src/prompts/{{lng}}/{{ns}}.json"),
  },
  interpolation: {
    escapeValue: false, // no escapar HTML (ideal para texto plano)
  },
});

module.exports = i18next;
