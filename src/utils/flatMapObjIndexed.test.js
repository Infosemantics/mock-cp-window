const flatMapObjIndexed = require("./flatMapObjIndexed.js");

test("Should map through object, but add new indexes", () => {
  const start = {
    a: "abc",
    x: "xyz",
  };

  const mapper = (str) => {
    return {
      [str[0]]: true,
      [str[1]]: true,
      [str[2]]: true,
    };
  };

  const result = flatMapObjIndexed(mapper, start);

  expect(result).toStrictEqual({
    a: true,
    b: true,
    c: true,

    x: true,
    y: true,
    z: true,
  });
});
