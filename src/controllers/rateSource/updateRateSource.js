import db from '../../models/index.js';
import { Op } from 'sequelize';
import { withTransaction } from '../../middleware/withTransaction.js';
import { findRateSourceById } from '../../query/rateSourceQueries.js';
import { CURRENCY_INCLUDE } from '../../query/includes.js';

export const updateRateSource = withTransaction(async (req, res) => {
  const rateSourceId = req.params?.id;

  const {
    name,
    type,
    location,
    link,
    rateSourceOrderId,
    currencyIds,
    newUpdatedAt,
  } = req.body;

  const { transaction } = req;

  const rateSource = await findRateSourceById(rateSourceId);

  if (!rateSource) {
    return res.status(404).send({ message: 'RateSource not found' });
  }

  if (name !== undefined) rateSource.name = name;
  if (type !== undefined) rateSource.type = type;
  if (location !== undefined) rateSource.location = location;
  if (link !== undefined) rateSource.link = link;
  if (rateSourceOrderId !== undefined)
    rateSource.rateSourceOrderId = rateSourceOrderId;
  if (newUpdatedAt !== undefined) rateSource.newUpdatedAt = newUpdatedAt;

  await rateSource.save({ transaction });

  if (currencyIds && Array.isArray(currencyIds)) {
    const currencies = await db.Currency.findAll({
      where: { id: { [Op.in]: currencyIds } },
    });

    if (currencies.length !== currencyIds.length) {
      return res
        .status(400)
        .send({ message: 'Some provided currency IDs do not exist' });
    }

    await rateSource.setCurrencies(currencies, { transaction });
  }

  const updatedRateSource = await findRateSourceById(rateSourceId, [
    CURRENCY_INCLUDE,
  ]);

  return res.status(200).send(updatedRateSource);
});
