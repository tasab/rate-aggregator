export const getString = (price) => {
  if (price === undefined || price === null) {
    return '';
  }

  const normalizedPrice =
    typeof price === 'string' ? price.replace(',', '.') : price;
  const numPrice = parseFloat(normalizedPrice);

  if (isNaN(numPrice)) {
    return '';
  }

  return numPrice.toString();
};

export const getUpperCode = (code) => {
  if (code === undefined || code === null || typeof code !== 'string') {
    return '';
  }

  return code.toUpperCase();
};

export const getLowerCode = (code) => {
  if (code === undefined || code === null || typeof code !== 'string') {
    return '';
  }

  return code.toLowerCase();
};
