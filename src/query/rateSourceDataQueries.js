import db from '../models/index.js';

const getRateSourceDataIncludes = () => ({});

export const findRateSourceDataById = (id, includeKeys = [], transaction) => {
  const include = includeKeys
    .map((key) => getRateSourceDataIncludes()[key])
    .filter(Boolean);

  return db.UserRate.findByPk(id, {
    include,
    transaction,
  });
};

export const findAllRateSourceData = (
  where = {},
  includeKeys = [],
  transaction = null
) => {
  const include = includeKeys
    .map((key) => getRateSourceDataIncludes()[key])
    .filter(Boolean);

  return db.RateSourceData.findAll({
    where,
    include,
    transaction,
    order: [['createdAt', 'DESC']],
  });
};
