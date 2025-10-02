import db from '../models/index.js';
import {
  CURRENCY_CONFIGS_INCLUDE,
  RATE_SOURCE_INCLUDE,
  TELEGRAM_INCLUDE,
} from './includes.js';

const getRateIncludes = () => ({
  [CURRENCY_CONFIGS_INCLUDE]: {
    model: db.RateCurrencyConfig,
    as: 'currencyConfigs',
    include: [
      {
        model: db.Currency,
        as: 'currency',
        attributes: ['id', 'code', 'fullName'],
      },
    ],
  },
  [RATE_SOURCE_INCLUDE]: {
    model: db.RateSource,
    as: 'rateSource',
    attributes: ['id', 'name', 'type', 'location', 'link', 'controllerType'],
    include: [
      {
        model: db.Currency,
        as: 'currencies',
        attributes: ['id', 'code', 'fullName'],
      },
    ],
  },
  [TELEGRAM_INCLUDE]: {
    model: db.TelegramConfig,
    as: 'telegramConfig',
  },
});

export const findUserRateById = (id, includeKeys = [], transaction) => {
  const include = includeKeys
    .map((key) => getRateIncludes()[key])
    .filter(Boolean);

  return db.UserRate.findByPk(id, {
    include,
    transaction,
  });
};

export const findAllUserRates = (
  where = {},
  includeKeys = [],
  transaction = null
) => {
  const include = includeKeys
    .map((key) => getRateIncludes()[key])
    .filter(Boolean);

  return db.UserRate.findAll({
    where,
    include,
    transaction,
    order: [['createdAt', 'DESC']],
  });
};
