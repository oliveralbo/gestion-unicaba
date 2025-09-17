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
    ns: "personalidades",
  });

  const temporalContext = i18n.t("contexto_actual", {
    fecha: hoy,
    usuario: "Oliverio",
    ns: "contexto_actual",
  });

  const personalidad = i18n.t("asistente", {
    fecha: hoy,
    usuario: "Oliverio",
    ns: "contexto_actual",
  });



  const structuredPrompt = {
    usuario: "Oliverio",
    fecha: hoy,
    isGroup,
    promptBase,
    contacto: contacto?.name || contacto?.number || "desconocido",
    personalidad,
    contexto: temporalContext,
    reglasGrupo: isGroup
      ? "Responde SOLO si te hacen una pregunta o mencionan 'Oli'."
      : null,
    autorMensaje,
    mensaje,
    instruccion: "Usa estos datos como contexto. Responde SOLO al campo 'mensaje'. No inventes claves nuevas."
  };

  return JSON.stringify(structuredPrompt, null, 2);

  // const promptFinal =
  //   contexto && personalidad
  //     ? `Personalidad:${personalidad},\n\n ${promptBase}\n\nContexto actual:\n${temporalContext}`
  //     : promptBase;

  // return promptFinal;
}

module.exports = { getPrompt };
