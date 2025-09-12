const axios = require("axios");
const memory = require("./chatMemory");
const { getPrompt } = require("./prompts");

const OR_KEY = process.env.OR_API_KEY;
const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

function isValidContactName(contactName) {
  return typeof contactName === "string" && contactName.trim().length > 0;
}

async function getAIResponse(prompt, contacto, tipo = "no_agendado") {
  const promptConContexto = getPrompt(tipo, contacto);
  console.log("promptConContexto: ", promptConContexto);
  const history = isValidContactName(contacto)
    ? memory.getHistory(contacto)
    : [];

  const messages = [
    { role: "system", content: promptConContexto },
    ...history,
    { role: "user", content: prompt },
  ];

  try {
    const res = await axios.post(
      OR_URL,
      {
        model: "deepseek/deepseek-chat-v3.1:free",
        messages,
        temperature: 0.5,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${OR_KEY}`,
          "HTTP-Referer": "http://localhost",
          "Content-Type": "application/json",
        },
      }
    );

    const respuesta = res.data.choices[0].message.content.trim();

    memory.addMessage(contacto, "user", prompt);
    memory.addMessage(contacto, "assistant", respuesta);

    return respuesta;
  } catch (err) {
    console.error("❌ Error en OpenRouter:", err.response?.data || err.message);
    return "No puedo contestar ahora. Intentá de nuevo más tarde.";
  }
}

module.exports = getAIResponse;
