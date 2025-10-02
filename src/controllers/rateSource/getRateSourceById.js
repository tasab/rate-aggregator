import { LOG_ERROR, logger } from '../../utils/logger.js';
import { findRateSourceById } from '../../query/rateSourceQueries.js';
import { findAllRateSourceData } from '../../query/rateSourceDataQueries.js';
import { CURRENCY_INCLUDE } from '../../query/includes.js';
import { getLowerCode } from '../../utils/rateUtils.js';

export const getRateSourceById = async (req, res) => {
  try {
    const { id: rateSourceId } = req.params;
    if (!rateSourceId) {
      return res.status(404).send({ error: 'Rate Source ID is required' });
    }
    const { includeRate } = req.query;
    let filteredRate = null;
    let prevRateSourceData = [];
    let latestRateSourceData = [];
    const rateSource = await findRateSourceById(rateSourceId, [
      CURRENCY_INCLUDE,
    ]);

    if (!rateSource) {
      return res.status(404).send({ error: 'Rate source not found' });
    }

    if (includeRate) {
      const latestRateSourceDataRaw = await findAllRateSourceData({
        rateSourceId,
        fetchedAt: rateSource.newUpdatedAt,
      });
      latestRateSourceData = latestRateSourceDataRaw.map((item) =>
        item.toJSON()
      );

      const prevRateSourceDataRaw = await findAllRateSourceData({
        rateSourceId,
        fetchedAt: rateSource.prevUpdatedAt,
      });
      prevRateSourceData = prevRateSourceDataRaw.map((item) => item.toJSON());

      const availableCurrencyCodes = rateSource.currencies.map((currency) =>
        getLowerCode(currency.code)
      );
      filteredRate = latestRateSourceData.filter((item) =>
        availableCurrencyCodes.includes(item.code)
      );
    }

    const parsedRate = filteredRate.map((item) => ({
      code: item.code,
      bid: parseFloat(item?.bid),
      sell: parseFloat(item.sell),
      prev: prevRateSourceData?.length
        ? prevRateSourceData.find(
            (prevItem) =>
              getLowerCode(prevItem.code) === getLowerCode(item.code)
          )
        : null,
    }));

    return res.status(200).send({
      rate: parsedRate,
      rateSource,
    });
  } catch (error) {
    logger(error, 'Failed to load: getRateSourceById', LOG_ERROR);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
