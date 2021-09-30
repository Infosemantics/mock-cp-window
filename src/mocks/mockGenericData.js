const { pipe, when, is, unless, always, mergeRight, omit } = require("ramda");
const mockStateData = require("./mockStateData");
const getSTClist = require("../utils/getSTClist");
const getNumberForName = require("../utils/getNumberForName");

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
      stl: mockStateData(slideObjectName, slideObject),
    }),
    omit(["states"]),
    when(always(!original), omit(["stc"]))
  )(slideObject);
}

module.exports = (slideObject, slideObjectName, uid, original = true) => {
  if (!slideObject) return {};

  return {
    [slideObjectName]: createSlideObjectAccessibilityData(
      slideObject,
      slideObjectName,
      original
    ),
    [slideObjectName + "c"]: {
      uid,
      dn: slideObjectName,
    },
  };
};
