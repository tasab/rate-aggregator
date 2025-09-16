import db from '../models/index.js';

export const getRateWithCurrencyConfigs = (rateId) =>
  db.Rate.findByPk(rateId, {
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
