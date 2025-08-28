const chatHistory = {};
const MAX_HISTORY_LENGTH = 40; // ida y vuelta: 20 mensajes de cada lado
const EXPIRATION_HOURS = 10;

function addMessage(contactName, role, content) {
  const now = Date.now();

  if (!chatHistory[contactName]) {
    chatHistory[contactName] = [];
  }

  chatHistory[contactName].push({
    role,
    content,
    timestamp: now,
  });

  if (chatHistory[contactName].length > MAX_HISTORY_LENGTH) {
    chatHistory[contactName].shift(); // eliminamos el más viejo
  }
}

function getHistory(contactName) {
  const now = Date.now();
  const expirationMs = EXPIRATION_HOURS * 60 * 60 * 1000;

  const history = chatHistory[contactName];
  if (!history) return [];

  const lastTimestamp = history[history.length - 1]?.timestamp || 0;
  if (now - lastTimestamp > expirationMs) {
    delete chatHistory[contactName];
    return [];
  }

  // devolvemos solo role y content, no timestamp
  return history.map(({ role, content }) => ({ role, content }));
}

function clearHistory(contactName) {
  delete chatHistory[contactName];
}

module.exports = {
  addMessage,
  getHistory,
  clearHistory,
};
