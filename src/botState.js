let isBotOn = true;

function turnOn() {
  isBotOn = true;
}

function turnOff() {
  isBotOn = false;
}

function getStatus() {
  return isBotOn;
}

module.exports = {
  turnOn,
  turnOff,
  getStatus,
};
