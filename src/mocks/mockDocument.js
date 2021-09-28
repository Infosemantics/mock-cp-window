const mockDiv = (name, data) => {
  return {
    id: name,
  };
};
module.exports = (data) => {
  return {
    getElementById: jest.fn((name) => {
      if (data.slideObjects && slideObjects.hasOwnProperty(name))
        return mockDiv(name, slideObjects[name]);

      return null;
    }),
  };
};
