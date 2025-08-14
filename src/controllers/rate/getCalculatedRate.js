import db from '../../models/index.js';
import { parseRate } from '../../utils/rateUtils.js';
import { getLatestSourceData } from '../../helpers/getLatestSourceData.js';

export const getCalculatedRate = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const rateId = req.params?.rateId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!rateId) {
      return res.status(400).json({ message: 'rateId is required' });
    }

    const rate = await db.Rate.findByPk(rateId, {
      include: [
        {
          model: db.Currency,
          through: { attributes: [] },
          attributes: ['id', 'code', 'fullName'],
          as: 'currencies',
        },
        {
          model: db.CurrencyRateConfig,
          as: 'currencyConfigs',
          include: [
            {
              model: db.Currency,
              attributes: ['id', 'code'],
              as: 'currency',
            },
          ],
        },
        {
          model: db.RateSource,
          attributes: ['id', 'name', 'type', 'location', 'link'],
          as: 'rateSource',
        },
      ],
    });

    if (!rate) {
      return res.status(404).json({ message: 'Rate not found' });
    }

    const rateCurrencies = rate.currencies;
    const currencyConfigs = rate.currencyConfigs;

    const enrichedRateSourceData = await getLatestSourceData(
      rate.rateSource?.id
    );

    const calculatedRates = rateCurrencies.map((currency) => {
      const rateData = enrichedRateSourceData.find((data) => {
        return data.currency_code === currency.code;
      });

      const rateConfig = currencyConfigs.find(
        (config) => config.currency.code === currency.code
      );

      if (rateData && rateConfig) {
        const calculatedRate = parseRate(
          {
            bid: rateData.bid_rate,
            sell: rateData.sell_rate,
            updated: rateData.fetched_at,
          },
          rateConfig
        );
        return { currency: currency.code, calculatedRate };
      }

      return {
        currency: currency.code,
        error: 'Missing rate data or configuration',
      };
    });

    return res.status(200).json({
      rate,
      calculatedRates,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
