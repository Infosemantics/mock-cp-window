const getNumberForName = require("./getNumberForName");

module.exports = (name) => {
  return `si${getNumberForName(name)}`;
};
