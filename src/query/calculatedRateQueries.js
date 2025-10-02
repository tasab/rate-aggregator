import db from '../models/index.js';

const getCalculatedRateIncludes = () => ({});

export const findCalculatedRateById = (id, includeKeys = [], transaction) => {
  const include = includeKeys
    .map((key) => getCalculatedRateIncludes()[key])
    .filter(Boolean);

  return db.CalculatedRate.findByPk(id, {
    include,
    transaction,
  });
};

export const findAllCalculatedRates = (
  where = {},
  includeKeys = [],
  transaction = null
) => {
  const include = includeKeys
    .map((key) => getCalculatedRateIncludes()[key])
    .filter(Boolean);

  return db.CalculatedRate.findAll({
    where,
    include,
    transaction,
  });
};
