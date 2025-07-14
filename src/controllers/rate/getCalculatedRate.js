import db from '../../models/index.js';
import { parseRate } from '../../utils/rateUtils.js';
import sequelize, { Op } from 'sequelize';

export const getCalculatedRate = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId; // Support for token or query
    const rateId = req.params?.rateId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!rateId) {
      return res.status(400).json({ message: 'rateId is required' });
    }

    // Fetch rate by ID and include associated data
    const rate = await db.Rate.findByPk(rateId, {
      include: [
        {
          model: db.Currency,
          through: { attributes: [] }, // Exclude join-table
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

    const rateCurrencies = rate.currencies; // List of currencies
    const currencyConfigs = rate.currencyConfigs; // Currency configurations

    // Fetch only the latest `RateSourceData` for each currencyCode
    const latestRateSourceData = await db.RateSourceData.findAll({
      where: { rate_source_id: rate.rateSource?.id }, // Use correct column name
      attributes: [
        'currency_code', // Use correct column name
        [sequelize.fn('MAX', sequelize.col('fetched_at')), 'latest_fetched_at'], // Use correct column name
      ],
      group: ['currency_code'], // Group by correct column name
      raw: true,
    });

    if (latestRateSourceData.length === 0) {
      return res.status(404).json({ message: 'Rate source data not found' });
    }

    // Retrieve full details for the latest records
    const enrichedRateSourceData = await db.RateSourceData.findAll({
      where: {
        [Op.or]: latestRateSourceData.map((item) => ({
          currency_code: item.currency_code,
          fetched_at: item.latest_fetched_at,
        })),
      },
      attributes: ['currency_code', 'bid_rate', 'sell_rate'], // Use correct column names
      raw: true,
    });

    const calculatedRates = rateCurrencies.map((currency) => {
      const rateData = enrichedRateSourceData.find((data) => {
        return data.currency_code === currency.code;
      });

      const rateConfig = currencyConfigs.find(
        (config) => config.currency.code === currency.code
      );

      if (rateData && rateConfig) {
        // Calculate the adjusted rate using parseRate
        const calculatedRate = parseRate(
          { bid: rateData.bid_rate, sell: rateData.sell_rate }, // Adjusted for correct column names
          rateConfig
        );
        return { currency: currency.code, calculatedRate };
      }

      return {
        currency: currency.code,
        error: 'Missing rate data or configuration',
      };
    });

    // Step 3: Return the calculated rates
    return res.status(200).json({
      rate,
      calculatedRates,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
