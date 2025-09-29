import db from '../models/index.js';
import { CURRENCY_INCLUDE } from './includes.js';

const getRateSourceIncludes = () => ({
  [CURRENCY_INCLUDE]: {
    model: db.Currency,
    through: { attributes: [] },
    attributes: ['id', 'code', 'fullName'],
    as: 'currencies',
  },
});

export const findRateSourceById = (id, includeKeys = [], transaction) => {
  const include = includeKeys
    .map((key) => getRateSourceIncludes()[key])
    .filter(Boolean);

  return db.RateSource.findByPk(id, {
    include,
    transaction,
  });
};

export const findAllRateSources = (
  where = {},
  includeKeys = [],
  transaction = null
) => {
  const include = includeKeys
    .map((key) => getRateSourceIncludes()[key])
    .filter(Boolean);

  return db.RateSource.findAll({
    where,
    include,
    transaction,
    order: [['createdAt', 'DESC']],
  });
};
