const { pipe, when, is, unless, always, mergeRight, omit } = require("ramda");
const mockStateData = require("./mockStateData");
const getSTClist = require("../utils/getSTClist");

function createSlideObjectAccessibilityData(
  slideObject,
  slideObjectName,
  original
) {
  return pipe(
    unless(is(Object), always({})),
    mergeRight({
      apsn: "Slide1",
      stc: getSTClist(slideObject, slideObjectName),
      mdi: slideObjectName + "c",
      stl: mockStateData(slideObject),
    }),
    omit(["states"]),
    when(always(!original), omit(["stc"]))
  )(slideObject);
}

module.exports = (slideObject, slideObjectName, original = true) => {
  if (!slideObject) return {};
  return {
    [slideObjectName]: createSlideObjectAccessibilityData(
      slideObject,
      slideObjectName,
      original
    ),
    [slideObjectName + "c"]: {
      dn: slideObjectName,
    },
  };
};
