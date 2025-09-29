import {
  ROUND_DEFAULT,
  ROUND_DOWN,
  ROUND_UP,
} from '../constants/roundingType.js';

export const applyMargin = (price, margin) => {
  const result = Number(price) + Number(margin);

  return parseFloat(result.toFixed(10));
};

export const getRoundingCb = (type) => {
  switch (type) {
    case ROUND_DEFAULT:
      return Math.round;
    case ROUND_UP:
      return Math.ceil;
    case ROUND_DOWN:
      return Math.floor;
  }
};

export const applyRounding = (value, depth, roundType, shouldRound) => {
  let res = value;
  if (shouldRound) {
    const factor = Math.pow(10, depth);
    const roundFunc = getRoundingCb?.(roundType);
    res = roundFunc?.(value * factor) / factor;
  }
  return res;
};

export const parseRate = (rate, config) => {
  const bidMarginPrice = applyMargin(rate?.bid, config?.bidMargin);

  const adjustedBid = applyRounding(
    bidMarginPrice,
    config?.bidRoundingDepth,
    config?.bidRoundingType,
    config?.bidShouldRound
  );

  const sellMarginPrice = applyMargin(rate?.sell, config?.sellMargin);
  const adjustedSell = applyRounding(
    sellMarginPrice,
    config?.sellRoundingDepth,
    config?.sellRoundingType,
    config?.sellShouldRound
  );

  return {
    bid: adjustedBid,
    sell: adjustedSell,
  };
};

export const hasRateChanged = (prev, current) => {
  const sellChanged = parseFloat(prev?.sell) !== parseFloat(current?.sell);
  const bidChanged = parseFloat(prev?.bid) !== parseFloat(current?.bid);
  return sellChanged || bidChanged;
};

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
