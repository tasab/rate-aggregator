import { findUserRateById } from '../query/userRateQueries.js';
import { findAllCalculatedRates } from '../query/calculatedRateQueries.js';
import { CURRENCY_CONFIGS_INCLUDE } from '../query/includes.js';
import { getLowerCode } from '../utils/stringUtils.js';

export const getUserRate = async (rateId, transaction) => {
  if (!rateId) {
    throw new Error('Rate ID is required');
  }

  const rateInfo = await findUserRateById(
    rateId,
    [CURRENCY_CONFIGS_INCLUDE],
    transaction
  );

  const prevRatesInstances = await findAllCalculatedRates(
    { calculatedAt: rateInfo?.prevUpdatedAt },
    [],
    transaction
  );

  const newRatesInstances = await findAllCalculatedRates(
    { calculatedAt: rateInfo?.newUpdatedAt },
    [],
    transaction
  );

  const prevRates = prevRatesInstances.map((rate) => rate.toJSON());
  const newRates = newRatesInstances.map((rate) => rate.toJSON());

  if (!newRates.length) {
    throw new Error('Current rates not found');
  }

  if (!rateInfo) {
    throw new Error('Rate not found');
  }

  // Order newRates to match the same order as rate.currencyConfigs
  const orderedNewRates = rateInfo.currencyConfigs.reduce((acc, config) => {
    const matchingRate = newRates.find(
      (rateItem) =>
        getLowerCode(rateItem.code) === getLowerCode(config.currency?.code)
    );

    if (matchingRate) {
      acc.push(matchingRate);
    }

    return acc;
  }, []);

  const currencyRates = orderedNewRates.map((item) => ({
    ...item,
    prev: prevRates.length
      ? prevRates.find((prevItem) => prevItem.code === item.code)
      : null,
  }));

  return {
    rateInfo,
    currencyRates,
  };
};
