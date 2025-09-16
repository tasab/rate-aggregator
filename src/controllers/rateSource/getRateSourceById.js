import db from '../../models/index.js';
import { LOG_ERROR, logger } from '../../utils/logger.js';
import { getLatestRateSourceData } from '../../query/getLatestRateSourceData.js';

export const getRateSourceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ error: 'Rate Source ID is required' });
    }
    const { includeRate } = req.query;
    let filteredRate = null;

    const currentSource = await db.RateSource.findByPk(id, {
      include: [
        {
          model: db.Currency,
          through: { attributes: [] },
          attributes: ['id', 'code', 'fullName'],
          as: 'currencies',
        },
      ],
    });

    if (!currentSource) {
      return res.status(404).send({ error: 'Rate source not found' });
    }

    if (includeRate) {
      const latestRateSourceData = await getLatestRateSourceData(id);
      const availableCurrencyCodes = currentSource.currencies.map((currency) =>
        currency.code?.toLowerCase()
      );
      filteredRate = latestRateSourceData.filter((item) =>
        availableCurrencyCodes.includes(item.currency_code)
      );
    }

    const parsedRate = filteredRate.map((item) => ({
      code: item.currency_code,
      bid: parseFloat(item?.bid_rate),
      sell: parseFloat(item.sell_rate),
      updated: item.fetched_at,
    }));

    return res.status(200).send({
      rate: parsedRate,
      currentSource,
    });
  } catch (error) {
    logger(error, 'Failed to load: getRateSourceById', LOG_ERROR);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
