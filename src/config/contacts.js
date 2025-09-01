// Configuración centralizada de contactos para el bot de WhatsApp
const assistant = require('./assistant');
const config = assistant.getConfig();

class ContactManager {
  constructor() {
    this.defaultContact = {
      nombre: 'Usuario',
      personalidad: config.personalidad,
      impronta: config.impronta,
      notas: 'Contacto genérico para números no configurados',
      esGrupo: false,
      activo: true
    };

    // Almacenamiento interno de contactos
    this.contacts = new Map();
    this.groups = new Map();
    
    // Cargar contactos predefinidos
    this._loadDefaultContacts();
  }

  /**
   * Carga los contactos predefinidos
   * @private
   */
  _loadDefaultContacts() {
    // Contactos individuales
    this.addContact({
      id: '5491111222333',
      nombre: 'Cliente Importante',
      personalidad: 'asistente_profesional',
      impronta: 'super_profesional',
      notas: 'Preferencia por respuestas detalladas y formales',
      activo: true
    });

    // Grupos
    this.addGroup({
      id: '1234567890@c.us',
      nombre: 'Equipo de Desarrollo',
      personalidad: 'asistente_eficiente',
      impronta: 'profesional',
      activo: true,
      integrantes: ['Juan', 'María', 'Carlos']
    });

    // Grupo inactivo
    this.addGroup({
      id: 'patria-grande',
      nombre: 'Patria Grande Tres de Febrero',
      activo: false,
      notas: 'Grupo inactivo que no recibirá respuestas del bot'
    },{
      id: 'asamblea vecinal',
      nombre: 'Asamblea Vecinal 3F - Saludos y Avisos varios',
      activo: false,
      notas: 'Grupo inactivo que no recibirá respuestas del bot'
    });
  }

  /**
   * Añade un contacto individual
   * @param {Object} contact - Configuración del contacto
   */
  addContact(contact) {
    const contactConfig = {
      ...this.defaultContact,
      ...contact,
      esGrupo: false
    };
    this.contacts.set(contact.id, contactConfig);
    return contactConfig;
  }

  /**
   * Añade un grupo
   * @param {Object} group - Configuración del grupo
   */
  addGroup(group) {
    const groupConfig = {
      ...this.defaultContact,
      ...group,
      esGrupo: true
    };
    this.groups.set(group.id, groupConfig);
    return groupConfig;
  }

  /**
   * Obtiene la configuración de un contacto o grupo
   * @param {string} identifier - Número de teléfono, ID de chat o nombre de grupo
   * @param {Object} [chat] - Objeto de chat de whatsapp-web.js (opcional)
   * @returns {Object} Configuración del contacto/grupo
   */
  getConfig(identifier, chat = null) {
    if (!identifier && !chat) {
      return { ...this.defaultContact };
    }

    // Manejar grupos
    if (chat?.isGroup) {
      const groupName = chat.name?.trim() || '';
      
      // Buscar por ID de grupo
      const groupById = this.groups.get(identifier);
      if (groupById) return { ...this.defaultContact, ...groupById };
      
      // Buscar por nombre exacto
      for (const [_, group] of this.groups) {
        if (group.nombre === groupName) {
          return { ...this.defaultContact, ...group };
        }
      }

      // Grupo no configurado
      return {
        ...this.defaultContact,
        nombre: groupName || 'Grupo',
        esGrupo: true,
        personalidad: 'asistente_eficiente',
        impronta: 'profesional'
      };
    }

    // Manejar contactos individuales
    if (identifier) {
      const cleanNumber = identifier.toString().replace(/\D/g, '');
      const contact = this.contacts.get(cleanNumber) || this.contacts.get(identifier);
      
      if (contact) {
        return { ...this.defaultContact, ...contact };
      }
    }

    // Contacto no encontrado
    return {
      ...this.defaultContact,
      nombre: chat?.name || identifier || 'Usuario',
      esGrupo: false
    };
  }

  /**
   * Verifica si un contacto o grupo está activo
   * @param {string} identifier - Identificador del contacto/grupo
   * @param {Object} [chat] - Objeto de chat (opcional)
   * @returns {boolean} true si está activo
   */
  isActive(identifier, chat = null) {
    const contactConfig = this.getConfig(identifier, chat);
    return contactConfig.activo !== false;
  }

  /**
   * Obtiene todos los contactos
   * @returns {Array} Lista de contactos
   */
  getAllContacts() {
    return Array.from(this.contacts.values());
  }

  /**
   * Obtiene todos los grupos
   * @returns {Array} Lista de grupos
   */
  getAllGroups() {
    return Array.from(this.groups.values());
  }
}

// Exportar una instancia singleton
const contactManager = new ContactManager();

// Mantener compatibilidad con el código existente
const getContactConfig = (phoneNumber, chat) => contactManager.getConfig(phoneNumber, chat);
const defaultContact = { ...contactManager.defaultContact };
const contactos = Object.fromEntries([
  ...contactManager.contacts,
  ...contactManager.groups
]);

module.exports = {
  contactManager,
  getContactConfig,
  defaultContact,
  contactos
};
