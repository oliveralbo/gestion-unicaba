const axios = require("axios");
const { format } = require("date-fns");
const { es } = require("date-fns/locale");
const { getPrompt } = require("./prompts");
const assistantConfig = require("./config/assistant");

// Configuración de la API de OpenRouter
const OR_API_KEY = process.env.OR_API_KEY;
const DEFAULT_MODEL = "openai/gpt-3.5-turbo"; // Modelo actualizado a uno compatible
const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

// Historial de conversación por contacto
const conversationHistory = new Map();

// Máximo de mensajes a mantener en el historial
const MAX_HISTORY_LENGTH = 20;

/**
 * Formatea un mensaje para el historial de conversación
 * @param {string} role - Rol del mensaje (user/assistant)
 * @param {string} content - Contenido del mensaje
 * @returns {Object} Mensaje formateado
 */
function formatMessage(role, content) {
  return { role, content: content.trim() };
}

/**
 * Verifica si el asistente está en horario laboral
 * @returns {boolean} true si está en horario laboral
 */
function isWorkingHours() {
  if (!assistantConfig.horario.activo) return true;

  try {
    const now = new Date();
    const [startHour, startMinute] = assistantConfig.horario.inicio
      .split(":")
      .map(Number);
    const [endHour, endMinute] = assistantConfig.horario.fin
      .split(":")
      .map(Number);

    const startTime = new Date(now);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(now);
    endTime.setHours(endHour, endMinute, 0, 0);

    return now >= startTime && now <= endTime;
  } catch (error) {
    console.error("Error al verificar horario laboral:", error);
    return true; // Por defecto, asumir que está en horario laboral
  }
}

/**
 * Obtiene una respuesta de la IA basada en el mensaje y el contexto
 * @param {string} message - Mensaje del usuario
 * @param {Object} context - Contexto de la conversación
 * @param {Object} context.contacto - Información del contacto
 * @param {Object} context.asistente - Información del asistente
 * @param {string} context.duenio - Nombre del dueño del asistente
 * @returns {Promise<string>} Respuesta de la IA
 */
async function getAIResponse(message, context) {
  const { contacto, asistente, duenio } = context;

  try {
    // Verificar si está fuera de horario laboral
    if (!isWorkingHours() && !contacto.esGrupo) {
      return assistantConfig.respuestas.fueraDeHorario;
    }

    // Obtener el historial de conversación
    const history = conversationHistory.get(contacto.numero) || [];

    // Construir el contexto completo para el prompt
    const promptContext = {
      ...contacto,
      asistente: {
        ...asistente,
        // Asegurarse de que la personalidad y la impronta estén definidas
        personalidad: asistente.personalidad || "asistente_profesional",
        impronta: asistente.impronta || "profesional",
      },
      duenio: duenio.nombre || "el usuario",
      fecha: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es }),
      // Incluir configuración adicional si es necesario
      ...(context.configuracion && { configuracion: context.configuracion }),
    };

    // Obtener el prompt del sistema con el contexto completo
    const systemPrompt = getPrompt("general", promptContext);

    // Construir los mensajes para la API
    const messages = [
      formatMessage("system", systemPrompt),
      ...history,
      formatMessage("user", message),
    ];

    // Llamar a la API de OpenRouter
    const response = await axios.post(
      OR_URL,
      {
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OR_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 segundos de timeout
      }
    );

    // Obtener y limpiar la respuesta de la IA
    let aiResponse = response.data.choices[0].message.content.trim();

    // Reemplazar variables en la respuesta
    const replacements = {
      "asistente.nombre": asistente.nombre,
      "asistente.rol": asistente.rol || "",
      "duenio.nombre": duenio.nombre || "el usuario",
      "duenio.rol": duenio.rol || "",
      "contacto.nombre": contacto.nombre || "Usuario",
      fecha: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es }),
    };

    // Aplicar reemplazos
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\s*${key}\\s*\\}`, "g");
      aiResponse = aiResponse.replace(regex, value);
    });

    // Agregar firma si está configurado
    if (context.configuracion?.incluirFirma && context.configuracion?.firma) {
      let firma = context.configuracion.firma;
      Object.entries(replacements).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\s*${key}\\s*\\}`, "g");
        firma = firma.replace(regex, value);
      });
      aiResponse += firma;
    }

    // Actualizar el historial de conversación
    const newHistory = [
      ...history,
      formatMessage("user", message),
      formatMessage("assistant", aiResponse),
    ].slice(-MAX_HISTORY_LENGTH * 2);

    conversationHistory.set(contacto.numero, newHistory);

    return aiResponse;
  } catch (error) {
    console.error("❌ Error al obtener respuesta de la IA:", error);

    // Manejar errores específicos
    if (error.response) {
      console.error(
        "Error de la API:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("No se recibió respuesta de la API");
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }

    // Devolver un mensaje de error apropiado
    return assistantConfig.respuestas.error;
  }
}

module.exports = {
  getAIResponse,
};
