const botState = require("../botState");

async function handleControlCommands(message) {
  const { fromMe } = message;
  const chat = await message.getChat();
  const chatName = chat.name;

  if (chatName !== "Archivos personales" || !fromMe) return;

  const body = message.body.trim().toLowerCase();

  if (body === "#boton") {
    botState.turnOn();
    await message.reply("✅ Bot activado.");
  }

  if (body === "#botoff") {
    botState.turnOff();
    await message.reply("🛑 Bot desactivado.");
  }

  return;
}

module.exports = handleControlCommands;
