const getSINumberForName = require("./getSINumberForName.js");
const isArray = require("./isArray.js");

module.exports = (slideObjectData, slideObjectName) => {
  if (!slideObjectData.states) return [slideObjectName];
  if (isArray(slideObjectData.states))
    return [slideObjectName, ...slideObjectData.states.map(getSINumberForName)];
};
