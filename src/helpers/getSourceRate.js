import { findRateSourceById } from '../query/rateSourceQueries.js';
import { CURRENCY_INCLUDE } from '../query/includes.js';
import { findAllRateSourceData } from '../query/rateSourceDataQueries.js';
import { getLowerCode } from '../utils/stringUtils.js';
import { getNumber } from '../utils/numberUtils.js';

export const getSourceRate = async (rateSourceId, transaction) => {
  let filteredRate = null;
  let prevRateSourceData = [];
  let latestRateSourceData = [];
  const rateSource = await findRateSourceById(
    rateSourceId,
    [CURRENCY_INCLUDE],
    transaction
  );

  if (!rateSource) {
    throw new Error('Rate source not found');
  }

  const latestRateSourceDataRaw = await findAllRateSourceData(
    {
      rateSourceId,
      fetchedAt: rateSource.newUpdatedAt,
    },
    transaction
  );
  latestRateSourceData = latestRateSourceDataRaw.map((item) => item.toJSON());

  const prevRateSourceDataRaw = await findAllRateSourceData(
    {
      rateSourceId,
      fetchedAt: rateSource.prevUpdatedAt,
    },
    transaction
  );
  prevRateSourceData = prevRateSourceDataRaw.map((item) => item.toJSON());

  const availableCurrencyCodes = rateSource.currencies.map((currency) =>
    getLowerCode(currency.code)
  );
  filteredRate = latestRateSourceData.filter((item) =>
    availableCurrencyCodes.includes(item.code)
  );

  const currencyRates = filteredRate.map((item) => ({
    code: item.code,
    bid: getNumber(item?.bid),
    sell: getNumber(item.sell),
    prev: prevRateSourceData?.length
      ? prevRateSourceData.find(
          (prevItem) => getLowerCode(prevItem.code) === getLowerCode(item.code)
        )
      : null,
  }));

  return {
    rateInfo: rateSource,
    currencyRates,
  };
};
