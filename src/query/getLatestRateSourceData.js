import db from '../models/index.js';

export const getLatestRateSourceData = async (rateSourceId) => {
  const rateSource = await db.RateSource.findByPk(rateSourceId, {
    attributes: ['lastProcessedAt'],
  });

  if (!rateSource || !rateSource.lastProcessedAt) {
    return [];
  }

  return await db.RateSourceData.findAll({
    where: {
      rate_source_id: rateSourceId,
      fetched_at: rateSource.lastProcessedAt,
    },
    attributes: ['currency_code', 'bid_rate', 'sell_rate', 'fetched_at'],
    raw: true,
  });
};
