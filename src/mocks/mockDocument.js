const mockDiv = (name, data) => {
  return {
    id: name,
  };
};
module.exports = (data) => {
  return {
    getElementById: jest.fn((name) => {
      if (data.hasOwnProperty(name)) return mockDiv(name, data[name]);

      return null;
    }),
  };
};
