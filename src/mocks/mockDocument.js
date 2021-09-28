const mockDiv = (name, data) => {
  return {
    id: name,
  };
};
module.exports = (data) => {
  return {
    getElementById: jest.fn((name) => {
      if (data.slideObjects && data.slideObjects.hasOwnProperty(name))
        return mockDiv(name, data.slideObjects[name]);

      return null;
    }),
  };
};
