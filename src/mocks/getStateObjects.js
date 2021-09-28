const { mapObjIndexed, zipObj } = require("ramda");
const isArray = require("../utils/isArray");
const createSlideObjectDataMock = require("./mockGenericData.js");
const getSINumberForName = require("../utils/getSINumberForName.js");

module.exports = (slideObjectName, slideObjectStates) => {
  if (!slideObjectStates) return {};

  if (isArray(slideObjectStates))
    slideObjectStates = zipObj(slideObjectStates, slideObjectStates);

  let stateObjects = {};

  mapObjIndexed((stateName, stateData) => {
    const name = getSINumberForName(stateName);
    stateObjects = {
      ...createSlideObjectDataMock(true, name, false),
      ...stateObjects,
    };

    stateObjects[name].bstin = slideObjectName;
  }, slideObjectStates);

  return stateObjects;
};
