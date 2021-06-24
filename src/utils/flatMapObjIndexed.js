const { curry, mapObjIndexed, forEachObjIndexed } = require("ramda");

module.exports = curry(function (mapper, obj) {
  const result = mapObjIndexed(mapper, obj);

  const newList = {};

  forEachObjIndexed(function (value, key) {
    forEachObjIndexed(function (value, key) {
      newList[key] = value;
    }, value);
  }, result);

  return newList;
});
