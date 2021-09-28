const {
  prop,
  has,
  mapObjIndexed,
  pipe,
  without,
  when,
  values,
  objOf,
  isNil,
  is,
  unless,
  always,
  mergeRight,
  drop,
  omit,
} = require("ramda");
const mockDocument = require("./mocks/mockDocument");
const mockStateData = require("./mocks/mockStateData");
const flatMapObjIndexed = require("./utils/flatMapObjIndexed");
const getSINumberForName = require("./utils/getSINumberForName");

const createVariablesManager = when(
  has("variables"),
  pipe(
    prop("variables"),
    mapObjIndexed((val, key) => {
      return {
        name: key,
        systemDefined: false,
      };
    }),
    values,
    objOf("varInfos")
  )
);

function createCpAPIInterface(data, eventEmitter) {
  return {
    setVariableValue: jest.fn((name, val) => {
      const original = data.variables[name];

      data.variables[name] = val;
      eventEmitter.dispatchEvent("CPAPI_VARIABLEVALUECHANGED", {
        oldVal: original,
        newVal: val,
        varName: name,
      });
    }),

    getVariableValue: jest.fn((name) => data.variables[name]),
  };
}

function createCpAPIEventEmitter(data) {
  const variableListeners = {};
  const listeners = {};
  return {
    addEventListener: jest.fn((event, callback, varName) => {
      if (isNil(varName)) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
      } else {
        if (!variableListeners[varName]) variableListeners[varName] = [];
        variableListeners[varName].push(callback);
      }
    }),

    removeEventListener: jest.fn((event, callback, varName) => {
      if (isNil(varName)) {
        // NOT A VARIABLE EVENT
        if (!listeners[event]) return;
        listeners[event] = without([callback], listeners[event]);
      } else {
        if (!variableListeners[varName]) return;
        variableListeners[varName] = without(
          [callback],
          variableListeners[varName]
        );
      }
    }),

    dispatchEvent: jest.fn((event, varDetails) => {
      if (isNil(varDetails)) {
        if (listeners[event])
          listeners[event].forEach((method) =>
            method({
              type: event,
            })
          );
      } else {
        if (variableListeners[varDetails.varName])
          variableListeners[varDetails.varName].forEach((method) =>
            method({
              cpData: varDetails,
            })
          );
      }
    }),
  };
}

function createSlideObjectAccessibilityData(slideObject, slideObjectName) {
  return pipe(
    unless(is(Object), always({})),
    mergeRight({
      apsn: "Slide1",
      mdi: slideObjectName + "c",
      stl: mockStateData(slideObject),
    }),
    omit(["states"])
  )(slideObject);
}

function createSlideObjectDataMock(slideObject, slideObjectName) {
  // Pass in false, we want something that is NOT a slide object
  if (!slideObject) return {};

  let stateObjects = {};
  if (slideObject.states)
    slideObject.states.forEach((stateName) => {
      const name = getSINumberForName(stateName);
      stateObjects = {
        ...createSlideObjectDataMock(true, name),
        ...stateObjects,
      };
    });

  return {
    [slideObjectName]: createSlideObjectAccessibilityData(
      slideObject,
      slideObjectName
    ),
    [slideObjectName + "c"]: {
      dn: slideObjectName,
    },
    ...stateObjects,
  };
  // return pipe(
  //   unless(is(Object), always({})),
  //   mergeRight({
  //     apsn: "Slide1",
  //     mdi: slideObjectName + "c",
  //   })
  // )(slideObject);
}

function createCpData({ slideObjects }) {
  if (!slideObjects) return null;
  return flatMapObjIndexed(createSlideObjectDataMock, slideObjects);
}

/**
 * Receives settings and returns a fake window object to
 * simulate those settings
 *
 * {
 *   variables: {
 *      foo: "bar"
 *   }
 * }
 *
 * @param {object} Settings
 * @returns {object} A mocked version of the JavaScript window object.
 */
module.exports = function (data) {
  const eventEmitter = createCpAPIEventEmitter(data);
  const cpData = createCpData(data);

  return {
    document: mockDocument(cpData),
    cp: {
      variablesManager: createVariablesManager(data),
      D: cpData,
    },
    cpAPIInterface: createCpAPIInterface(data, eventEmitter),
    cpAPIEventEmitter: eventEmitter,
    alert: jest.fn(),
  };
};
