const getAIResponse = require("../ai");
const botState = require("../botState");
const rules = require("../prompts/es/contactRules.json"); // 👈 nueva config por contacto/chat

// const {
//   isSecta,
//   isTest,
//   isLuis,
//   isVerdaderosChetos,
//   isNuez,
//   isLasTias,
// } = require("../chatRules");
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
   rules[contact.number]; // fallback por número de teléfono

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

  // // desde aca las diferentes reglas.
  // if (isTest(contact)) {
  //   await processPrompt(message, prompt, contact, chat, "luis");
  //   return;
  // }

  // if (isNuez(chat)) {
  //   await processPrompt(message, prompt, contact, chat, "nuez");
  //   return;
  // }
  // console.log(isLasTias(chat));
  // if (isLasTias(chat)) {
  //   await processPrompt(message, prompt, contact, chat, "tias");
  //   return;
  // }

  // if (isSecta(chat, contact)) {
  //   await processPrompt(message, prompt, contact, chat, "la_secta");
  //   return;
  // }

  // if (isVerdaderosChetos(chat, contact)) {
  //   await processPrompt(
  //     message,
  //     prompt,
  //     contact,
  //     chat,
  //     "los_verdaderos_chetos"
  //   );
  //   return;
  // }

  // if (isLuis(chat, contact)) {
  //   await processPrompt(message, prompt, contact, chat, "luis");
  //   return;
  // }

  // si hay más reglas, se agregan abajo en el mismo estilo
}

module.exports = processMessage;
