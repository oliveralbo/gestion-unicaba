// Configuración de contactos para el bot de WhatsApp
// Aquí se definen las personalidades e improntas para cada contacto

// Importar configuración del asistente
const assistantConfig = require('./assistant');

// Contacto por defecto (se usará para números no listados)
const defaultContact = {
  nombre: 'Usuario',
  personalidad: assistantConfig.personalidad, // Usar la personalidad por defecto del asistente
  impronta: 'profesional',
  notas: 'Contacto genérico para números no configurados',
  esGrupo: false,
  activo: true // Por defecto, todos los contactos están activos
};

// Lista de contactos y grupos configurados
const contactos = {
  // Ejemplo: Contacto profesional
  '5491111222333': {
    nombre: 'Cliente Importante',
    personalidad: 'asistente_profesional',
    impronta: 'super_profesional',
    notas: 'Preferencia por respuestas detalladas y formales',
    esGrupo: false,
    activo: true
  },
  
  // Ejemplo: Grupo de trabajo
  '1234567890@c.us': {
    nombre: 'Equipo de Desarrollo',
    personalidad: 'asistente_eficiente',
    impronta: 'profesional',
    esGrupo: true,
    activo: true,
    integrantes: ['Juan', 'María', 'Carlos']
  },
  
  // Ejemplo de contacto inactivo
  '549999999999': {
    nombre: 'Contacto Inactivo',
    personalidad: 'asistente_eficiente',
    impronta: 'profesional',
    esGrupo: false,
    activo: false,
    notas: 'Este contacto no recibirá respuestas del bot'
  },
  
  // Grupo inactivo por nombre
  'Patria Grande Tres de Febrero': {
    nombre: 'Patria Grande Tres de Febrero',
    esGrupo: true,
    activo: false,
    notas: 'Grupo inactivo que no recibirá respuestas del bot'
  },

  'Asamblea Vecinal 3F - Saludos y Avisos varios': {
    nombre: 'Patria Grande Tres de Febrero',
    esGrupo: true,
    activo: false,
    notas: 'Grupo inactivo que no recibirá respuestas del bot'
  },

  '549999999999': {
    nombre: 'Contacto Inactivo',
    personalidad: 'asistente_eficiente',
    impronta: 'profesional',
    esGrupo: false,
    activo: false,
    notas: 'Este contacto no recibirá respuestas del bot'
  }
};

/**
 * Obtiene la configuración de un contacto o grupo
 * @param {string} phoneNumber - Número de teléfono o ID de chat
 * @param {object} [chat] - Objeto de chat de whatsapp-web.js (opcional)
 * @returns {object} Configuración del contacto o grupo
 */
function getContactConfig(phoneNumber, chat = null) {
  // Return default contact if phoneNumber is null/undefined
  if (!phoneNumber) {
    return { 
      ...defaultContact, 
      esGrupo: chat?.isGroup || false,
      nombre: chat?.name || 'Usuario'
    };
  }
  
  // Si es un grupo, buscar por nombre
  if (chat?.isGroup) {
    const nombreGrupo = chat.name || '';
    // Buscar configuración por nombre exacto del grupo
    const grupoConfig = Object.values(contactos).find(
      c => c.esGrupo && c.nombre === nombreGrupo
    );
    
    if (grupoConfig) {
      return { ...defaultContact, ...grupoConfig };
    }
  }
  
  // Si no es un grupo o no se encontró por nombre, buscar por número
  if (phoneNumber) {
    const cleanNumber = phoneNumber.toString().replace(/\D/g, '');
    const contacto = contactos[cleanNumber] || contactos[phoneNumber];
    
    if (contacto) {
      return { ...defaultContact, ...contacto };
    }
  }
  
  // If it's an unconfigured group
  if (chat?.isGroup) {
    return {
      ...defaultContact,
      nombre: chat.name || 'Grupo',
      esGrupo: true,
      personalidad: 'asistente_eficiente',
      impronta: 'profesional'
    };
  }
  
  // Si no se encuentra, devolver el contacto por defecto
  return { 
    ...defaultContact, 
    nombre: chat?.name || phoneNumber,
    esGrupo: false
  };
}

module.exports = {
  getContactConfig,
  defaultContact,
  contactos
};
