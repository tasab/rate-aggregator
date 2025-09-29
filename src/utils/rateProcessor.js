import db from '../models/index.js';
import {
  getLowerCode,
  getNumber,
  hasRateChanged,
  parseRate,
} from './rateUtils.js';

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
  const newCalculatedRates = [];
  const calculatedRatesPromises = [];

  for (const config of rate.currencyConfigs) {
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
        code: getLowerCode(config?.currency?.code),
      });

      if (hasChanged) {
        rateHasChanges = true;

        const calculatedRatePromise = db.CalculatedRate.upsert(
          {
            rateId: rate?.id,
            code: config?.currency?.code,
            bid: newParsedRate?.bid,
            sell: newParsedRate?.sell,
            sourceRateDataId: sourceData?.id,
            calculatedAt: newUpdatedAt,
          },
          { transaction }
        );

        calculatedRatesPromises.push(calculatedRatePromise);
      }
    }
  }

  return {
    rateHasChanges,
    newCalculatedRates,
    previousCalculatedRates,
    calculatedRatesPromises,
  };
};
