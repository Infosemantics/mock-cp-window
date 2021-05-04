import index from "./index.js";

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
