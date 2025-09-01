const { getAIResponse } = require("../ai");
const botState = require("../botState");
const { getContactConfig } = require("../config/contacts");
const assistantConfig = require("../config/assistant");

/**
 * Procesa un mensaje entrante de WhatsApp
 * @param {Message} message - Objeto de mensaje de whatsapp-web.js
 */
async function processMessage(message) {
  console.log("HOOOLAAAA ");
  // Verificar si el bot está activo
  if (!botState.getStatus()) {
    console.log("🤖 Bot desactivado. Ignorando mensaje.");
    return;
  }

  const { body } = message;
  if (!body || body.trim() === "") {
    console.log("Mensaje vacío recibido");
    return;
  }

  try {
    // Obtener información del contacto y chat
    const contact = await message.getContact();
    const chat = await message.getChat();

    // Obtener configuración del contacto
    const contactConfig = getContactConfig(contact.number, chat);
    
    // Verificar si el contacto está activo
    if (contactConfig.activo === false) {
      console.log(`🤖 Ignorando mensaje de contacto inactivo: ${contact.number}`);
      return; // No responder a contactos inactivos
    }

    // Construir contexto para la IA
    const context = {
      mensaje: body,
      contacto: {
        nombre: contact.name || contact.pushName || "Usuario",
        numero: contact.number,
        esGrupo: chat.isGroup,
        // Sobrescribir con la configuración específica del contacto si existe
        ...contactConfig,
      },
      // Información del asistente (configurable en assistant.js)
      asistente: {
        ...assistantConfig.asistente,
        // La personalidad puede ser sobrescrita por contacto
        ...(contactConfig.personalidad && {
          personalidad: contactConfig.personalidad,
        }),
        // La impronta puede ser sobrescrita por contacto
        ...(contactConfig.impronta && { impronta: contactConfig.impronta }),
      },
      // Información del dueño (configurable en assistant.js)
      duenio: assistantConfig.duenio,
      // Configuración adicional
      configuracion: assistantConfig.configuracion,
    };

    // Si es un grupo, agregar información adicional
    if (chat.isGroup) {
      const participants = await chat.participants;
      context.contacto.integrantes = participants
        .map((p) => p.name || p.number)
        .filter((name) => name !== assistantConfig.asistente.nombre);
    }

    // Obtener respuesta del asistente
    const response = await getAIResponse(body, context);

    // Enviar respuesta
    await chat.sendMessage(response);
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error);

    // Intentar enviar un mensaje de error
    try {
      await message.reply(assistantConfig.respuestas.error);
    } catch (e) {
      console.error("No se pudo enviar mensaje de error:", e);
    }
  }
}

module.exports = processMessage;
