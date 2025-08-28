const i18n = require("../i18n");
const fs = require("fs");
const path = require("path");
// este file junta el prompt con la personalidad necesaria con el prmopt de contexto actual.
const hoy = new Date().toLocaleDateString("es-AR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function getPrompt(tipo, contacto) {
  const promptBase = i18n.t(tipo, {
    contacto,
    ns: "prompts",
  });

  const contexto = i18n.t("contexto_actual", {
    fecha: hoy,
    ns: "contexto_actual",
  });

  const personalidad = i18n.t("oli", {
    fecha: hoy,
    ns: "contexto_actual",
  });

  const promptFinal =
    contexto && personalidad
      ? `Personalidad:${personalidad},\n\n ${promptBase}\n\nContexto actual:\n${contexto}`
      : promptBase;

  return promptFinal;
}

module.exports = { getPrompt };
