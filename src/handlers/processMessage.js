const { getAIResponse } = require("../ai");
const botState = require("../botState");
const { getContactConfig } = require("../config/contacts");
const assistant = require("../config/assistant");
const config = assistant.getConfig();

/**
 * Procesa un mensaje entrante de WhatsApp
 * @param {Message} message - Objeto de mensaje de whatsapp-web.js
 */
async function processMessage(message) {
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
    const fechaActual = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const context = {
      // Información del mensaje
      mensaje: body,
      fecha: fechaActual,
      
      // Información del contacto
      contacto: {
        nombre: contact.name || contact.pushName || "Usuario",
        numero: contact.number,
        esGrupo: chat.isGroup,
        ...contactConfig, // Configuración específica del contacto
      },
      
      // Configuración del asistente
      asistente: {
        // Configuración base
        nombre: config.nombre,
        rol: config.rol || 'Asistente Virtual',
        
        // Personalidad e impronta (pueden ser sobrescritas por contacto)
        personalidad: contactConfig.personalidad || config.personalidad,
        impronta: contactConfig.impronta || config.impronta,
        
        // Comportamiento
        comportamiento: {
          ...config.comportamiento,
          instrucciones: [
            `Eres ${config.nombre}, el asistente virtual de ${config.duenio.nombre}.`,
            `Tu rol es: ${config.rol || 'asistir y responder consultas'}.`,
            `Debes comportarte como un ${contactConfig.personalidad || config.personalidad}.`,
            `Usa un tono ${contactConfig.impronta || config.impronta} en tus respuestas.`,
            contactConfig.notas ? `Notas adicionales: ${contactConfig.notas}` : ''
          ].filter(Boolean).join(' ')
        }
      },
      
      // Información del dueño
      duenio: {
        ...config.duenio,
        // Asegurar que el teléfono esté en formato internacional
        telefono: config.duenio.telefono.startsWith('+') 
          ? config.duenio.telefono 
          : `+${config.duenio.telefono.replace(/^\+/, '')}`
      }
    };

    // Si es un grupo, agregar información adicional
    if (chat.isGroup) {
      const participants = await chat.participants;
      context.contacto.integrantes = participants
        .map((p) => p.name || p.number)
        .filter((name) => name !== config.nombre);
    }
console.log(context);

    // Obtener respuesta del asistente
    const response = await getAIResponse(body, context);

    // Enviar respuesta
    await chat.sendMessage(response);
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error);

    // Intentar enviar un mensaje de error
    try {
await message.reply(config.mensajes.error);
    } catch (e) {
      console.error("No se pudo enviar mensaje de error:", e);
    }
  }
}

module.exports = processMessage;
