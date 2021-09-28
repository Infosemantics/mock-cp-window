const { forEach } = require("ramda");
const getNumberForName = require("../utils/getNumberForName");

function makeState(name) {
  return {
    stn: name,
    stsi: [getNumberForName(name)],
  };
}
module.exports = (slideObjectData) => {
  const data = [];
  if (slideObjectData.states)
    forEach((name) => {
      data.push(makeState(name));
    }, slideObjectData.states);

  return [makeState("Normal"), ...data];
};
