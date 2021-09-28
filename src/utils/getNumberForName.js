const usedNumbers = {};
const hash = {};

function createNumber(name) {
  let num = Math.round(Math.random() * 10000);
  if (usedNumbers[num]) return createNumber(name);

  usedNumbers[num] = true;
  return num;
}

module.exports = (name) => {
  if (hash[name]) return hash[name];

  hash[name] = createNumber(name);

  return hash[name];
};
