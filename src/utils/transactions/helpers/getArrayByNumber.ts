export const getArrayByNumber = (number, amount) => {
  const array = new Array(Math.floor(number / amount)).fill(amount);
  const residue = number % amount;

  if (residue) {
    array.push(residue);
  }

  return array;
};
