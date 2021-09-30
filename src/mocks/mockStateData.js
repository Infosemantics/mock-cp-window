const { forEach } = require("ramda");
const getNumberForName = require("../utils/getNumberForName");

function makeState(name, numName) {
  return {
    stn: name,
    stsi: [getNumberForName(numName)],
  };
}
module.exports = (slideObjectName, slideObjectData) => {
  const data = [];
  if (slideObjectData.states)
    slideObjectData.states.forEach((name) => {
      data.push(makeState(name, name));
    });

  return [makeState("Normal", slideObjectName), ...data];
};
