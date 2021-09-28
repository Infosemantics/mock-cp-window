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

  return {
    ...mockGenericData(slideObject, slideObjectName, original),
    ...stateObjects,
  };
}
module.exports = createSlideObjectDataMock;
