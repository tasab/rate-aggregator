export const getNumber = (price) => {
  if (price === undefined || price === null) {
    return 0;
  }

  const normalizedPrice =
    typeof price === 'string' ? price.replace(',', '.') : price;
  const numPrice = parseFloat(normalizedPrice);

  if (isNaN(numPrice)) {
    return 0;
  }

  return numPrice;
};
