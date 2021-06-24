const index = require("./index.js");

const anyFunction = expect.any(Function);

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
    cpAPIEventEmitter: {
      addEventListener: anyFunction,
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
      },
    });

    expect(mockWindow.cp.D).toStrictEqual({
      foo: {
        apsn: "Slide1",
        mdi: "fooc",
      },
      fooc: {
        dn: "foo",
      },
    });
  });
});
