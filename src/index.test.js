const index = require("./index.js");

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

    const stateNumber = mockWindow.cp.D.bar.stl[1].stsi[0];
    const stateName = `si${stateNumber}`;
    const stateNamec = `${stateName}c`;

    expect(mockWindow.document.getElementById("invalid")).toBe(null);
    expect(mockWindow.document.getElementById(stateNamec)).not.toBe(null);

    expect(mockWindow.cp.D).toStrictEqual({
      foo: {
        apsn: "Slide1",
        mdi: "fooc",
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
        ],
      },
      fooc: {
        dn: "foo",
      },
      bar: {
        apsn: "Slide1",
        mdi: "barc",
        stl: [
          {
            stn: "Normal",
            stsi: [anyNumber],
          },
          {
            stn: "selected",
            stsi: [anyNumber],
          },
        ],
      },
      barc: {
        dn: "bar",
      },
      [stateName]: {
        apsn: "Slide1",
        mdi: stateNamec,
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
