const getAIResponse = require("../ai");
const botState = require("../botState");
const rules = require("../prompts/es/contactRules.json");

// esta se usa abajo en las reglas
async function processPrompt(message, prompt, contact, chat, contextLabel) {
  try {
    const aiResponse = await getAIResponse(prompt, contact.name, contextLabel);
    await chat.sendMessage(aiResponse);
  } catch (err) {
    console.error(`Error al responder (${contextLabel}):`, err);
    await message.reply("⚠️ Lo siento, algo falló al consultar la IA.");
  }
}

async function processMessage(message) {
  if (!botState.getStatus()) {
    console.log("🤖 Bot desactivado. Ignorando mensaje.");
    return;
  }

  const { body } = message;
  if (!body) return;

  const contact = await message.getContact();
  const chat = await message.getChat();

  const prompt = body.slice(3).trim();
  if (!prompt) {
    return;
  }

   // 🔍 buscar regla por nombre de contacto o chat
   const rule =
   rules[contact.name] ||
   rules[chat.name] ||
   rules[contact.number];

 if (rule?.enabled) {
   console.log(
     `Aplicando regla para ${contact.name || chat.name}: estilo=${rule.style}`
   );
   await processPrompt(message, prompt, contact, chat, rule.style);
 } else {
   console.log(
     `No hay regla activa para ${contact.name} / ${chat.name}. Ignorando.`
   );
 }

}

module.exports = processMessage;
