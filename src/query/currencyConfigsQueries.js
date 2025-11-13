import db from '../models/index.js';

export const findAllCurrencyConfigs = (rateId, transaction) => {
  return db.RateCurrencyConfig.findAll({
    where: { rateId },
    include: [
      {
        model: db.Currency,
        as: 'currency',
      },
    ],
    order: [['order', 'ASC']],
    transaction,
  });
};
