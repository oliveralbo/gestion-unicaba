# Asistente WhatsApp IA

Bot de WhatsApp con integración de IA, prompts personalizados y reglas escalables. Ideal para automatizar respuestas y personalizar la experiencia según el contacto o grupo.

## Requisitos

- Node.js >= 16
- Una cuenta de WhatsApp
- Clave de API de [OpenRouter](https://openrouter.ai/)

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone <url-del-repo>
   cd asistente-whatsapp
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   - Copia el archivo de ejemplo y edítalo:
     ```bash
     cp .env.example .env
     ```
   - Abre `.env` y coloca tu clave de OpenRouter:
     ```env
     OR_API_KEY=tu_clave_de_openrouter
     ```

4. **Inicia el bot:**

   ```bash
   npm run dev
   ```

   Escanea el QR que aparece en consola con WhatsApp Web.

## Uso básico

- El bot responde automáticamente según reglas y prompts definidos.
- Para activar/desactivar el bot desde WhatsApp, envía estos comandos **desde tu chat personal llamado "Archivos personales"**:
  - `#boton` — Activa el bot
  - `#botoff` — Desactiva el bot

## Personalización y escalabilidad

### Agregar nuevas reglas de chat

1. Abre `src/chatRules.js`.
2. Agrega una nueva función que reciba el chat y/o contacto y devuelva `true` si aplica la regla. Ejemplo:
   ```js
   const isNuevoGrupo = (chat, contact) =>
     chat.name === 'Mi Grupo' && contact.name === 'Juan';
   ```
3. Exporta la función y agrégala en `src/handlers/processMessage.js` siguiendo el patrón:
   ```js
   if (isNuevoGrupo(chat, contact)) {
     await processPrompt(message, prompt, contact, chat, 'nuevo_grupo');
     return;
   }
   ```

### Agregar nuevos prompts o personalidades

1. Edita o agrega entradas en `src/prompts/es/prompts.json` para nuevos tipos de prompt.
2. Si necesitas un nuevo contexto o personalidad, edítalo en `src/prompts/es/contexto_actual.json`.
3. Usa la clave correspondiente como parámetro en la función `getPrompt`.

### Agregar nuevos idiomas

1. Crea una carpeta para el idioma en `src/prompts/` (ej: `en/` para inglés).
2. Agrega los archivos `prompts.json` y `contexto_actual.json` traducidos.
3. Configura el idioma en `i18n.js` si lo deseas por defecto.

## Estructura del proyecto

- `index.js`: Entrada principal, inicializa el bot.
- `src/handlers/`: Lógica para procesar mensajes y comandos.
- `src/chatRules.js`: Reglas para decidir cómo responder según chat/contacto.
- `src/prompts/`: Prompts y contextos por idioma.
- `src/ai.js`: Lógica de integración con la IA.
- `src/chatMemory.js`: Memoria de conversación por contacto.

## Notas de seguridad

- **Nunca subas tu archivo `.env` con claves reales a repositorios públicos.**
- La clave de OpenRouter es privada y solo debe estar en `.env`.

## Ejemplo de archivo `.env.example`

```env
OR_API_KEY=tu_clave_de_openrouter
```

---

¿Dudas o sugerencias? Abre un issue o contacta a Oliverio.
