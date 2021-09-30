const { mapObjIndexed, zipObj } = require("ramda");
const isArray = require("../utils/isArray");
const createSlideObjectDataMock = require("./mockGenericData.js");
const getSINumberForName = require("../utils/getSINumberForName.js");
const getNumberForName = require("../utils/getNumberForName");

module.exports = (slideObjectName, slideObjectStates) => {
  if (!slideObjectStates) return {};

  if (isArray(slideObjectStates))
    slideObjectStates = zipObj(slideObjectStates, slideObjectStates);

  let stateObjects = {};

  mapObjIndexed((stateName, stateData) => {
    const name = getSINumberForName(stateName);
    const uid = getNumberForName(stateName);
    stateObjects = {
      ...createSlideObjectDataMock(true, name, uid, false),
      ...stateObjects,
    };

    stateObjects[name].bstin = slideObjectName;
    stateObjects[name].bstiid = getNumberForName(slideObjectName);
  }, slideObjectStates);

  return stateObjects;
};
