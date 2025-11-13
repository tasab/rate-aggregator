import db from '../models/index.js';
import { hasRateChanged, parseRate } from './rateUtils.js';
import { getLowerCode } from './stringUtils.js';
import { getNumber } from './numberUtils.js';
import { findAllCurrencyConfigs } from '../query/currencyConfigsQueries.js';

export const processRateCalculations = async (
  rate,
  rateSourceData,
  prevUpdatedAt,
  newUpdatedAt,
  transaction
) => {
  const previousCalculatedRates = await db.CalculatedRate.findAll({
    where: { rateId: rate.id, calculatedAt: prevUpdatedAt },
    transaction,
  });

  let rateHasChanges = false;
  let calculatedRatesPromises = [];
  const newCalculatedRates = [];

  const currencyConfigs = await findAllCurrencyConfigs(rate?.id, transaction);

  for (const config of currencyConfigs) {
    const sourceData = rateSourceData.find(
      (data) =>
        getLowerCode(data?.code) === getLowerCode(config?.currency?.code)
    );

    if (sourceData) {
      const newParsedRate = parseRate(
        {
          bid: getNumber(sourceData?.bid),
          sell: getNumber(sourceData.sell),
        },
        config
      );

      const prevParsedRate = previousCalculatedRates.find(
        (item) =>
          getLowerCode(item?.code) === getLowerCode(config?.currency?.code)
      );

      const hasChanged = hasRateChanged(newParsedRate, prevParsedRate);

      newCalculatedRates.push({
        ...newParsedRate,
        sourceRateDataId: sourceData?.id,
        code: getLowerCode(config?.currency?.code),
        rateId: rate?.id,
      });

      if (hasChanged) {
        rateHasChanges = true;
      }
    }
  }

  if (rateHasChanges) {
    calculatedRatesPromises = newCalculatedRates.map(async (rateItem) => {
      return await db.CalculatedRate.create(
        {
          rateId: rate?.id,
          code: rateItem?.code,
          bid: rateItem?.bid,
          sell: rateItem?.sell,
          sourceRateDataId: rateItem?.sourceRateDataId,
          calculatedAt: newUpdatedAt,
        },
        { transaction }
      );
    });
  }

  return {
    rateHasChanges,
    newCalculatedRates,
    previousCalculatedRates,
    calculatedRatesPromises,
  };
};
