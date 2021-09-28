const mockDiv = (name, data) => {
  return {
    id: name,
  };
};
export default (data) => {
  return {
    getElementById: (name) => {
      if (data.slideObjects && slideObjects.hasOwnProperty(name))
        return mockDiv(name, slideObjects[name]);

      return null;
    },
  };
};
