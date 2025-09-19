<p align="center">
  <img src="./assets/logo.jpeg" alt="GestiON Logo" width="300"/>
</p>

# GestiON - Asistente Personal para WhatsApp

**GestiON** es un asistente personal para WhatsApp diseñado para ahorrarte tiempo y ayudarte a gestionar tus conversaciones. Utiliza inteligencia artificial a través de [OpenRouter](https://openrouter.ai/) para generar respuestas automáticas, actuando como tu propio secretario/a personal.

El producto puede ser utilizado tanto para fines personales (B2C) como profesionales (B2B).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

1.  **Git**: Un sistema para descargar (clonar) el código del proyecto desde su repositorio. Puedes descargarlo desde [git-scm.com](https://git-scm.com/).
2.  **Node.js**: El entorno que permite ejecutar el bot. Al instalar Node.js, también se instala `npm`, el gestor de paquetes que usaremos para las dependencias.
    -   Puedes descargarlo desde [nodejs.org](https://nodejs.org/). Se recomienda la versión LTS.

## Guía de Instalación y Puesta en Marcha

A continuación, se detallan los pasos para poner en funcionamiento el bot en tu propia computadora.

### Paso 1: Clonar el Proyecto

Primero, abre una terminal o línea de comandos y clona el repositorio del proyecto con el siguiente comando:

```bash
git clone https://github.com/oliveralbo/gestion-unicaba
```

Luego, navega al directorio que se acaba de crear:

```bash
cd whatsapp-ia-bot
```

### Paso 2: Instalar las Dependencias

Dentro del directorio del proyecto, ejecuta el siguiente comando para instalar todos los componentes necesarios para que el bot funcione:

```bash
npm install
```

### Paso 3: Configurar tu Token de OpenRouter

El bot necesita un "token" o "clave" para poder conectarse al servicio de inteligencia artificial. Sigue estos pasos para obtener el tuyo:

1.  **Crea una cuenta en OpenRouter**: Ve a [openrouter.ai/keys](https://openrouter.ai/keys) y regístrate.
2.  **Obtén tu clave (API Key)**: Una vez dentro de tu panel, crea una nueva clave y cópiala. Esta clave es secreta y no debes compartirla.
3.  **Configura la clave en el proyecto**:
    -   En el directorio del proyecto, crea una copia del archivo de ejemplo `.env.example` y renómbrala a `.env`.
    -   Abre el nuevo archivo `.env` con un editor de texto y pega la clave que copiaste, de la siguiente manera:

    ```
    OR_API_KEY=aqui_va_tu_clave_secreta_de_openrouter
    ```

### Paso 4: Ejecutar el Proyecto

Con todo configurado, inicia el bot con el siguiente comando en la terminal:

```bash
npm run dev
```

Al ejecutarlo por primera vez, aparecerá un **código QR** en la terminal. Deberás escanearlo con tu teléfono desde la aplicación de WhatsApp, en la sección `Ajustes > Dispositivos vinculados > Vincular un dispositivo`.

Una vez escaneado, el bot se conectará a tu cuenta de WhatsApp y estará listo para funcionar.

### Paso 5: Controlar el Estado del Bot (ON/OFF)

Por defecto, el bot está encendido. Sin embargo, puedes activarlo o desactivarlo en cualquier momento enviando un mensaje desde tu propio número de WhatsApp (es decir, en el chat que tienes contigo mismo).

-   Para **apagar** el bot, envía el mensaje: `#botOFF`
-   Para **encender** el bot, envía el mensaje: `#botON`

El bot te confirmará el cambio de estado con un mensaje de respuesta.

## Cómo Personalizar tu Asistente

Para que el bot responda de manera auténtica, es fundamental que lo personalices con tu información.

### 1. Cambia tu Nombre de Usuario

El bot se refiere al usuario principal por un nombre. Para cambiarlo:

1.  Abre el archivo `src/finalContextBuilder.js`.
2.  En las líneas que dicen `usuario: "Oliverio"`, reemplaza `"Oliverio"` por tu nombre.

### 2. Adapta el Contexto del Bot

El "contexto" es la información clave sobre ti que el bot utiliza para responder. Para modificarlo:

1.  Abre el archivo `src/prompts/es/contexto_actual.json`.
2.  Modifica el texto dentro de `"contexto_actual"`. Aquí debes describir tu profesión, horarios, gustos o cualquier dato que quieras que el bot conozca para responder en tu nombre.

    *   **Importante**: Este es el archivo más importante para la personalidad del bot. Sé tan detallado como desees.

### 3. Define Reglas para tus Contactos

Puedes controlar cómo y a quién responde el bot. Para ello:

1.  Abre el archivo `src/prompts/es/contactRules.json`.
2.  En este archivo, puedes agregar reglas para contactos o grupos específicos, usando su nombre (tal como aparece en tu agenda) o su número de teléfono.

    -   `"enabled"`: Ponlo en `true` si quieres que el bot responda a ese contacto, o `false` para ignorarlo.
    -   `"style"`: Define un estilo de respuesta (ej. `"profesional"`, `"amigable"`). Los estilos se configuran en `src/prompts/es/personalidades.json`.
    -   `"isGroup"`: Ponlo en `true` si es un chat grupal.

**Ejemplo de configuración:**

```json
{
  "Nombre de un Amigo": {
    "enabled": true,
    "style": "amigable",
    "isGroup": false
  },
  "Grupo del Trabajo": {
    "enabled": true,
    "style": "profesional",
    "isGroup": true
  },
  "5491122334455": { // Un número que no tienes agendado
    "enabled": false, // El bot no le responderá
    "style": "cauto",
    "isGroup": false
  }
}
```

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
