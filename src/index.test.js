const index = require("./index.js");
const getNumberForName = require("./utils/getNumberForName.js");

const anyFunction = expect.any(Function);
const anyNumber = expect.any(Number);

test("expect to be defined", () => {
  expect(index).toBeDefined();
});

test("expect to mock variables", () => {
  const mockWindow = index({
    variables: {
      foo: "bar",
    },
  });

  expect(mockWindow).toStrictEqual({
    alert: anyFunction,
    document: {
      getElementById: anyFunction,
    },
    cpAPIEventEmitter: {
      addEventListener: anyFunction,
      removeEventListener: anyFunction,
      dispatchEvent: anyFunction,
    },
    cpAPIInterface: {
      getVariableValue: anyFunction,
      setVariableValue: anyFunction,
    },
    cp: {
      variablesManager: {
        varInfos: [
          {
            name: "foo",
            systemDefined: false,
          },
        ],
      },
      D: null,
    },
  });

  expect(mockWindow.cpAPIInterface.getVariableValue("foo")).toBe("bar");
});

describe("Mock slide objects", () => {
  test("Create basic slide object data", () => {
    const mockWindow = index({
      slideObjects: {
        foo: true,
        bar: {
          states: ["selected"],
        },
      },
    });

    // const stateNumber = mockWindow.cp.D.bar.stl[1].stsi[0];
    const stateNumber = getNumberForName("selected");
    const stateName = `si${stateNumber}`;
    const stateNamec = `${stateName}c`;

    const fooNumber = getNumberForName("foo");

    expect(mockWindow.document.getElementById("invalid")).toBe(null);
    expect(mockWindow.document.getElementById(stateNamec)).not.toBe(null);

    expect(mockWindow.cp.D).toStrictEqual({
      foo: {
        apsn: "Slide1",
        mdi: "fooc",
        stc: ["foo"],
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
        ],
      },
      fooc: {
        uid: fooNumber,
        dn: "foo",
      },
      bar: {
        apsn: "Slide1",
        mdi: "barc",
        stc: ["bar", stateName],
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
          {
            stn: "selected",
            stsi: [stateNumber],
          },
        ],
      },
      barc: {
        uid: anyNumber,
        dn: "bar",
      },
      [stateName]: {
        apsn: "Slide1",
        mdi: stateNamec,
        bstin: "bar",
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
        ],
      },
      [stateNamec]: {
        uid: anyNumber,
        dn: stateName,
      },
    });
  });

  test.skip("Create slide object data for slide object with multiple objects inside a state", () => {
    const objectName = "hello";
    const objectNamec = "helloc";

    const mockWindow = index({
      slideObjects: {
        foo: {
          states: {
            selected: {
              extraObjects: [objectName],
            },
          },
        },
      },
    });

    const stateNumber = mockWindow.cp.D.foo.stl[1].stsi[0];
    const stateName = `si${stateNumber}`;
    const stateNamec = `${stateName}c`;

    const objectNumber = mockWindow.cp.D.foo.stl[1].stsi[1];

    expect(mockWindow.document.getElementById("invalid")).toBe(null);
    expect(mockWindow.document.getElementById(stateNamec)).not.toBe(null);

    expect(mockWindow.cp.D).toStrictEqual({
      foo: {
        apsn: "Slide1",
        mdi: "fooc",
        stc: ["foo", stateName],
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
          {
            stn: "selected",
            stsi: [stateNumber, anyNumber],
          },
        ],
      },
      fooc: {
        dn: "foo",
      },
      [stateName]: {
        apsn: "Slide1",
        mdi: stateNamec,
        bstin: "foo",
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
        ],
      },
      [stateNamec]: {
        dn: stateName,
      },
      [objectName]: {
        apsn: "Slide1",
        mdi: objectNamec,
        bstiid: anyNumber,
        stl: [
          {
            stn: "Normal",
            stsi: [objectNumber],
          },
        ],
      },
      [objectNamec]: {
        // In the real world this property would not exist
        // for a state's sub-shape
        dn: objectName,
      },
    });
  });
});

describe("Mock events", () => {
  test("Add and remove generic events", () => {
    const mockWindow = index({
      variables: {
        anything: "anything",
      },
    });

    let counter = 0;
    const count = () => counter++;

    mockWindow.cpAPIEventEmitter.addEventListener("count", count);
    mockWindow.cpAPIEventEmitter.dispatchEvent("count");
    expect(counter).toBe(1);

    mockWindow.cpAPIEventEmitter.removeEventListener("count", count);
    mockWindow.cpAPIEventEmitter.dispatchEvent("count");
    expect(counter).toBe(1);
  });

  test("Add and remove variable events", () => {
    const mockWindow = index({
      variables: {
        foobar: "default",
      },
    });

    let counter = 0;
    const count = () => counter++;

    mockWindow.cpAPIEventEmitter.addEventListener(
      "CPAPI_VARIABLEVALUECHANGED",
      count,
      "foobar"
    );
    mockWindow.cpAPIInterface.setVariableValue("foobar", "new");
    expect(counter).toBe(1);

    mockWindow.cpAPIEventEmitter.removeEventListener(
      "CPAPI_VARIABLEVALUECHANGED",
      count,
      "foobar"
    );
    mockWindow.cpAPIInterface.setVariableValue("foobar", "old");
    expect(counter).toBe(1);
  });
});
