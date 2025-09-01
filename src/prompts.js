const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const fs = require('fs');
const path = require('path');

// Cargar archivos de configuración
const loadJsonFile = (filename) => {
  const filePath = path.join(__dirname, 'prompts', 'es', filename);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error al cargar el archivo ${filename}:`, error);
    return null;
  }
};

// Cargar configuraciones
const personalidades = loadJsonFile('contexto_actual.json')?.personalidades || {};
const improntas = loadJsonFile('prompts.json')?.improntas || {};
const mensajesPredeterminados = loadJsonFile('prompts.json')?.mensajes_predeterminados || {};

/**
 * Obtiene un prompt basado en el tipo y el contexto
 * @param {string} type - Tipo de prompt a generar
 * @param {Object} context - Contexto para el prompt
 * @returns {string} El prompt generado
 */
function getPrompt(type, context = {}) {
  const {
    fecha = format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es }),
    personalidad = 'asistente_profesional',
    impronta = 'profesional',
    nombre = 'Usuario',
    asistente = {},
    duenio = 'el usuario',
    esGrupo = false
  } = context;

  // Obtener configuraciones
  const configPersonalidad = personalidades[personalidad] || personalidades.asistente_profesional;
  const configImpronta = improntas[impronta] || improntas.profesional;
  
  // Construir el prompt base
  let prompt = `Eres ${configPersonalidad.nombre}, ${configPersonalidad.descripcion}

`;

  // Agregar información sobre el tono de comunicación
  prompt += `Tono de comunicación: ${configImpronta.descripcion}\n`;
  prompt += `Ejemplo de tono: "${configImpronta.ejemplo}"\n\n`;

  // Agregar contexto actual
  const contextoActual = loadJsonFile('contexto_actual.json')?.contexto_actual || '';
  prompt += `Hoy es ${fecha}. ${contextoActual.replace('{{fecha}}', fecha)}\n\n`;

  // Agregar información del contacto
  if (esGrupo) {
    prompt += `Estás hablando en un grupo llamado "${nombre}". `;
    if (context.integrantes?.length) {
      prompt += `Los integrantes son: ${context.integrantes.join(', ')}. `;
    }
  } else {
    prompt += `Estás hablando con ${nombre}. `;
  }

  // Agregar información del asistente
  prompt += `Eres el asistente de ${duenio}. `;
  if (asistente.rol) {
    prompt += `Tu rol es: ${asistente.rol}. `;
  }

  // Agregar instrucciones finales
  prompt += `\nRecuerda mantener tu personalidad de ${configPersonalidad.nombre} `;
  prompt += `y usar un tono ${configImpronta.tono} (${configImpronta.tratamiento}). `;
  
  if (context.notas) {
    prompt += `\nNotas adicionales: ${context.notas}`;
  }

  return prompt;
}

/**
 * Obtiene un mensaje predeterminado
 * @param {string} key - Clave del mensaje
 * @param {Object} context - Contexto para reemplazar variables
 * @returns {string} El mensaje formateado
 */
function getDefaultMessage(key, context = {}) {
  let message = mensajesPredeterminados[key] || '';
  
  // Reemplazar variables en el mensaje
  Object.entries(context).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\s*${key}\\s*\\}`, 'g');
    message = message.replace(regex, value);
  });
  
  return message;
}

module.exports = { 
  getPrompt,
  getDefaultMessage
};
