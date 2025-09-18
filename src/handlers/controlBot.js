const botState = require("../botState");

async function handleControlCommands(message, myJid) {
  const { fromMe, from } = message;

  if (myJid !== from || !fromMe) return;

  const body = message.body.trim()

  if (body === "#botON") {
    botState.turnOn();
    await message.reply("✅ Bot activado.");
  }

  if (body === "#botOFF") {
    botState.turnOff();
    await message.reply("🛑 Bot desactivado.");
  }

  return;
}

module.exports = handleControlCommands;
