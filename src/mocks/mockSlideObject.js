const getNumberForName = require("../utils/getNumberForName");
const getStateObjects = require("./getStateObjects");
const mockGenericData = require("./mockGenericData");

function createSlideObjectDataMock(
  slideObject,
  slideObjectName,
  original = true
) {
  // Pass in false, we want something that is NOT a slide object
  if (!slideObject) return {};

  // HANDLE SUB STATES
  let stateObjects = {};
  if (slideObject.states)
    stateObjects = getStateObjects(slideObjectName, slideObject.states) || {};

  const uid = getNumberForName(slideObjectName);
  return {
    ...mockGenericData(slideObject, slideObjectName, uid, original),
    ...stateObjects,
  };
}
module.exports = createSlideObjectDataMock;
