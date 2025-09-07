const isSecta = (chat, contact) => {
  // return chat.name?.startsWith("La Secta");
  chat.name?.startsWith("La Secta") &&
    ["German Bilancieri", "Tordo Ronzini"].includes(contact.name);
};

const isLasTias = (chat) => {
  // return chat.name?.startsWith("La Secta");
  return chat.name?.startsWith("Las tias!");
};

const isVerdaderosChetos = (chat, contact) => {
  return chat.name?.startsWith("Los verdaderos chetos");
};
// Twilio
const isTest = (contact) => {
  return contact.number === "14155238886";
};

const isNuez = (chat) => {
  return chat.name === "Nuez IA Hackathon 7 de Junio";
};

// Ejemplo: detectar si el mensaje vino de tu chat personal Este en relaiad no funca
const isLuis = (chat, contact) => {
  return contact.name === "Luis Petrecca" && chat.name === "Luis Petrecca";
};

module.exports = {
  isSecta,
  isTest,
  isLuis,
  isVerdaderosChetos,
  isNuez,
  isLasTias,
};
