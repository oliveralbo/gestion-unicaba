// Configuración del asistente personal
module.exports = {
  // Información del dueño del WhatsApp
  duenio: {
    nombre: 'Oliverio',
    rol: 'Dueño/Administrador',
    telefono: '+5491112345678' // Opcional: tu número de teléfono
  },
  
  // Información del asistente
  asistente: {
    nombre: 'Asistente',
    rol: 'Asistente Virtual Personal',
    // Personalidad por defecto (puede ser sobrescrita por contacto)
    personalidad: 'asistente_profesional',
    // Impronta por defecto (tono de comunicación)
    impronta: 'profesional'
  },
  
  // Configuración de respuestas
  respuestas: {
    saludo: "¡Hola! Soy el asistente de {{duenio.nombre}}. Actualmente no puede atenderte personalmente, pero estaré encantado de ayudarte en su lugar. ¿En qué puedo asistirte hoy?",
    despedida: "¡Hasta luego! Que tengas un excelente día.",
    fueraDeHorario: "Actualmente me encuentro fuera de mi horario laboral. Te responderé apenas pueda.",
    error: "⚠️ Ocurrió un error al procesar tu mensaje.",
    noEntendido: "Disculpá, no entendí bien. ¿Podrías reformular tu consulta?"
  },
  
  // Horario laboral (opcional)
  horario: {
    activo: false, // Cambiar a true para activar el horario
    inicio: '09:00',
    fin: '18:00',
    zonaHoraria: 'America/Argentina/Buenos_Aires',
    mensajeFueraDeHorario: "Fuera de horario laboral. Te responderé apenas pueda."
  },
  
  // Configuración adicional
  configuracion: {
    usarEmojis: true,
    longitudMaximaRespuesta: 500,
    incluirFirma: true,
    firma: "\n\nAtentamente,\n{{asistente.nombre}}\n{{asistente.rol}}"
  }
};
