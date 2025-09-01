// Configuración centralizada del asistente
module.exports = {
  // Información del dueño (único lugar donde se define)
  duenio: {
    nombre: 'Oliverio',
    rol: 'Dueño/Administrador',
    telefono: '+5491132686471'
  },
  
  // Configuración del asistente (valores por defecto)
  asistente: {
    nombre: 'Asistente',
    rol: 'Asistente Virtual Personal',
    personalidad: 'profesional',  // Valor simplificado
    impronta: 'profesional',
    
    // Mensajes predeterminados (únicos)
    mensajes: {
      saludo: "¡Hola! Soy el asistente de {{duenio.nombre}}. Actualmente no puede atenderte personalmente, pero estaré encantado de ayudarte en su lugar. ¿En qué puedo asistirte hoy?",
      despedida: "¡Hasta luego! Que tengas un excelente día.",
      error: "⚠️ Ocurrió un error al procesar tu mensaje.",
      noEntendido: "Disculpá, no entendí bien. ¿Podrías reformular tu consulta?",
      fueraDeHorario: "Actualmente me encuentro fuera de mi horario laboral. Te responderé apenas pueda."
    },
    
    // Comportamiento
    comportamiento: {
      usarEmojis: true,
      longitudMaximaRespuesta: 500,
      incluirFirma: true,
      firma: "\n\nAtentamente,\n{{asistente.nombre}}"
    },
    
    // Horario laboral
    horario: {
      activo: false,
      inicio: '09:00',
      fin: '18:00',
      zonaHoraria: 'America/Argentina/Buenos_Aires',
      mensajeFueraDeHorario: "Fuera de horario laboral. Te responderé apenas pueda."
    }
  },
  
  // Función auxiliar para obtener configuración con valores por defecto
  getConfig(overrides = {}) {
    const defaultConfig = {
      ...this.asistente,
      duenio: this.duenio
    };
    
    return {
      ...defaultConfig,
      ...overrides,
      mensajes: {
        ...defaultConfig.mensajes,
        ...(overrides.mensajes || {})
      },
      comportamiento: {
        ...defaultConfig.comportamiento,
        ...(overrides.comportamiento || {})
      },
      horario: {
        ...defaultConfig.horario,
        ...(overrides.horario || {})
      }
    };
  }
};
