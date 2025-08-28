require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const handleControlCommands = require("./src/handlers/controlBot");
const processMessage = require("./src/handlers/processMessage");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Asistente de IA corriendo correctamente.");
});

client.on("message_create", async (message) => {
  //para enviar mis mensajes y controlar la app
  await handleControlCommands(message);
  return;
});

client.on("message", async (message) => {
  await processMessage(message);
});

client.initialize();
