import db from '../models/index.js';
import sequelize, { Op } from 'sequelize';

export const getLatestSourceData = async (rateSourceId) => {
  const latestRateSourceData = await db.RateSourceData.findAll({
    where: { rate_source_id: rateSourceId },
    attributes: [
      'currency_code',
      [sequelize.fn('MAX', sequelize.col('fetched_at')), 'latest_fetched_at'],
    ],
    group: ['currency_code'],
    raw: true,
  });

  return await db.RateSourceData.findAll({
    where: {
      [Op.or]: latestRateSourceData.map((item) => ({
        currency_code: item.currency_code,
        fetched_at: item.latest_fetched_at,
      })),
    },
    attributes: ['currency_code', 'bid_rate', 'sell_rate', 'fetched_at'], // Use correct column names
    raw: true,
  });
};
